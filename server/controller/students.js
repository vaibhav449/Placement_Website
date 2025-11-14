const fs = require('fs/promises');
const cloudinary = require('../utils/cloudinary');
const Student = require('../models/students');
const Company = require('../models/companies');
const Application = require('../models/application');
const { getCloudinaryId } = require('../utils/helperPublicId');
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Use memoryStorage on serverless (no disk writes)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Accept only PDF files (adjust if you want images/docs)
    const allowedTypes = [
        'application/pdf',
        'text/csv',
        'application/csv',
        'text/plain', // some CSV uploads may come as text/plain
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, CSV and Excel files are allowed!'), false);
    }
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Helper to upload a Buffer to Cloudinary using upload_stream (no extra dependency)
const { Readable } = require('stream');
const uploadBufferToCloudinary = (buffer, options = {}) => {
    options = Object.assign({ resource_type: 'auto' }, options);
    return new Promise((resolve, reject) => {
        try {
            const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
                if (err) {
                    console.error('Cloudinary upload error:', err);
                    return reject(err);
                }
                resolve(result);
            });
            const read = new Readable();
            read._read = () => {}; // noop
            read.push(buffer);
            read.push(null);
            read.pipe(uploadStream);
        } catch (e) {
            console.error('uploadBufferToCloudinary exception:', e);
            reject(e);
        }
    });
};

// Helper function to generate JWT token
const generateToken = (userId, role, isProfileCompleted) => {
    return jwt.sign(
        {
            id: userId,
            role: role,
            isProfileCompleted: isProfileCompleted
        },
        process.env.JWT_SECRET || 'your-secret-key', // Make sure to set this in your .env file
        { expiresIn: '30d' }
    );
};

// Helper function to check if profile is completed
const checkProfileCompletion = (student) => {
    if (!student) return false;
    const details = student.details || {};

    const hasCgpa = typeof details.cgpa === 'number' && !isNaN(details.cgpa);
    const hasActiveBacklogs = typeof details.activeBacklogs === 'number' && !isNaN(details.activeBacklogs);

    return Boolean(
        student.name &&
        student.email &&
        student.password &&
        student.role &&
        details.rollNo &&
        details.semester &&
        details.course &&
        details.graduationYear &&
        hasCgpa &&
        hasActiveBacklogs &&
        student.defaultResume
    );
};


// Get current user profile
const getUserProfile = async (req, res) => {
    try {
        console.log("Fetching profile for user ID:", req.user.id);
        const userId = req.user.id;

        const student = await Student.findById(userId).select('-password');
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Check profile completion
        const isProfileCompleted = checkProfileCompletion(student);

        res.status(200).json({
            success: true,
            message: "Profile found",
            data: {
                user: {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    role: student.role,
                    isProfileCompleted: isProfileCompleted,
                    details: student.details ? student.details : {},
                    defaultResume: student.defaultResume ? student.defaultResume : null
                }
            }
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Update student profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fields come from multipart/form-data (FormData)
        const {
            name,
            rollNo,
            semester,
            course,
            branch,
            year,
            graduationYear,
            cgpa,
            activeBacklogs,
            oldPassword,
            newPassword
        } = req.body;

        const student = await Student.findById(userId);
        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Ensure details object exists
        student.details = student.details || {};

        // Update basic fields if provided
        if (typeof name !== 'undefined' && name !== '') student.name = name;
        if (typeof rollNo !== 'undefined' && rollNo !== '') student.details.rollNo = rollNo;
        if (typeof semester !== 'undefined' && semester !== '') student.details.semester = semester;
        if (typeof course !== 'undefined' && course !== '') student.details.course = course;
        if (typeof branch !== 'undefined' && branch !== '') student.details.branch = branch;
        if (typeof year !== 'undefined' && year !== '') student.details.year = year;
        if (typeof graduationYear !== 'undefined' && graduationYear !== '') student.details.graduationYear = graduationYear;

        // Numeric fields parsing & validation
        if (typeof cgpa !== 'undefined' && cgpa !== '') {
            const parsedCgpa = parseFloat(cgpa);
            if (isNaN(parsedCgpa)) {
                return res.status(400).json({ success: false, message: "Invalid CGPA value." });
            }
            student.details.cgpa = parsedCgpa;
        }
        if (typeof activeBacklogs !== 'undefined' && activeBacklogs !== '') {
            const parsedBacklogs = parseInt(activeBacklogs, 10);
            if (isNaN(parsedBacklogs)) {
                return res.status(400).json({ success: false, message: "Invalid activeBacklogs value." });
            }
            student.details.activeBacklogs = parsedBacklogs;
        }

        // Optional password change (frontend sends oldPassword + newPassword)
        if (oldPassword || newPassword) {
            if (!oldPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Both oldPassword and newPassword are required to change password."
                });
            }
            const isMatch = await bcrypt.compare(oldPassword, student.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Old password is incorrect." });
            }
            const salt = await bcrypt.genSalt(10);
            student.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle uploaded resume (field name: 'resume')
        if (req.file && (req.file.buffer || req.file.path)) {
            console.log('Uploading resume:', req.file.originalname, 'mimetype=', req.file.mimetype);

            // Delete previous resume from Cloudinary if exists
            if (student.defaultResume) {
                const { publicId, resourceType } = getCloudinaryId(student.defaultResume);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType || 'raw' });
                    } catch (e) {
                        console.warn('Failed to delete previous resume from Cloudinary', e);
                    }
                }
            }

            let uploadResult;
            if (req.file.buffer) {
                uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
                    folder: 'placement/resumes',
                    resource_type: 'raw'
                });
            } else {
                uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'placement/resumes',
                    resource_type: 'raw'
                });
            }
            student.defaultResume = uploadResult.secure_url;
        }

        // Recompute profile completion and save
        student.profileIsCompleted = checkProfileCompletion(student);
        await student.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    role: student.role,
                    isProfileCompleted: student.profileIsCompleted,
                    details: student.details,
                    defaultResume: student.defaultResume || null
                }
            }
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



// Get all companies
const getAllCompanies = async (req, res) => {
    // if profile is not completed ask the user to complete the profile first
    if (req.isProfileCompleted === false) {
        return res.status(400).json({
            success: false,
            message: "Please complete your profile before viewing companies"
        });
    }

    try {
        const companies = await Company.find({});
        console.log("Fetched companies in getAllCompanies:", companies);
        
        // Return success with empty array if no companies exist
        if (!companies || companies.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No companies are visiting right now",
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Companies retrieved successfully",
            data: companies
        });
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Apply to a company (uploads resume to Cloudinary if provided)
const applyToCompany = async (req, res) => {
  // If you already gate this route with requireCompleteProfile, this check is redundant.
  if (req.isProfileCompleted === false) {
    return res.status(400).json({
      success: false,
      message: "Please complete your profile before applying"
    });
  }

const { companyId } = req.body;
  const studentId = req.user?.id;

  if (!companyId) {
    return res.status(400).json({ success: false, message: "Company ID is required" });
  }
  if (!studentId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  

  let tempFilePath = req.file?.path; // kept for backward compatibility if ever used

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const existingApplication = await Application.findOne({ userId: studentId, companyId });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied to this company" });
    }

    // check if company has some required cgpa or other criteria in futures
  if (company.requiredCgpa && student.cgpa < company.requiredCgpa) {
    return res.status(400).json({
      success: false,
      message: `Your CGPA is below the required ${company.requiredCgpa}.`
    });
  }


    // Decide resume URL: upload file to Cloudinary if present; else use defaultResume
    let resumeUrl;
    if (req.file?.buffer) {
      const upload = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'placement/resumes',
        resource_type: 'auto'
      });
      resumeUrl = upload.secure_url;
    } else if (tempFilePath) {
      const upload = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'placement/resumes',
        resource_type: 'auto'
      });
      resumeUrl = upload.secure_url;
    } else if (student.defaultResume) {
      resumeUrl = student.defaultResume;
    } else {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume or set a default resume"
      });
    }

    const newApplication = new Application({
      userId: studentId,
      companyId,
      resume: resumeUrl,
      status: "applied"
    });

    await newApplication.save();

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: {
        applicationId: newApplication._id,
        companyName: company.name,
        status: newApplication.status
      }
    });
  } catch (error) {
    console.error("Error applying to company:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  } finally {
      // nothing to cleanup for memory uploads
      if (tempFilePath) {
        try { await fs.unlink(tempFilePath); } catch {}
      }
   }
};

// Get student's applications
const getMyApplications = async (req, res) => {
        if(req.isProfileCompleted === false){
        return res.status(400).json({
            success: false,
            message: "Please complete your profile before viewing companies"
        });
    }
    
    try {
        const studentId = req.user.id; // Assuming user ID comes from authentication middleware

        const applications = await Application.find({ userId: studentId })
            .populate('companyId', 'title description ')
            .sort({ createdAt: -1 });
        // Check if applications array is empty (length is 0)
            // If empty, return success with empty array instead of 404 error
        if (applications.length === 0) {
            return res.status(200).json({
            success: true,
            message: "No applications found",
            data: []
            });
        }
        if (!applications ) {
            return res.status(404).json({
                success: false,
                message: "No applications found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Applications retrieved successfully",
            data: applications
        });

    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// Update default resume
const updateDefaultResume = async (req, res) => {
    let tempPath;
    try {
        const studentId = req.user.id;

        if (!req.file?.path && !req.file?.buffer) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume file"
            });
        }

        tempPath = req.file.path;

        // Fetch student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const previousUrl = student.defaultResume || null;

        // Delete previous resume from Cloudinary
        if (previousUrl) {
            const { publicId, resourceType } = getCloudinaryId(previousUrl);
            console.log('Trying to delete from Cloudinary:', publicId, resourceType);
            if (publicId) {
                try {
                    const result = await cloudinary.uploader.destroy(publicId + '.pdf', { resource_type: resourceType || 'raw' });
                    console.log('Cloudinary deletion result:', result);
                    if (result.result === 'ok') {
                        console.log("Previous resume deleted from Cloudinary");
                    } else {
                        console.warn("Failed to delete previous resume from Cloudinary", result);
                    }
                } catch (err) {
                    console.warn("Failed to delete previous resume from Cloudinary", err);
                }
            }
        }

        // Upload new resume (buffer preferred)
        let uploadResult;
        if (req.file?.buffer) {
            uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
                folder: 'placement/resumes',
                resource_type: 'raw'
            });
        } else {
            uploadResult = await cloudinary.uploader.upload(tempPath, {
                folder: 'placement/resumes',
                resource_type: 'raw'
            });
        }

        student.defaultResume = uploadResult.secure_url;
        student.profileIsCompleted = checkProfileCompletion(student);
        await student.save();

        res.status(200).json({
            success: true,
            message: "Default resume updated successfully",
            data: { resumeUrl: uploadResult.secure_url }
        });
    } catch (error) {
        console.error("Error updating default resume:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    } finally {
        // nothing to cleanup for memory uploads; keep old disk cleanup just in case
        if (tempPath) {
            try { await fs.unlink(tempPath); } catch {}
        }
    }
};

// Delete application by ID
const deleteApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the application
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Delete resume from Cloudinary if present
        if (application.resume) {
            const { publicId, resourceType } = getCloudinaryId(application.resume);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType || 'raw' });
                } catch {
                    // Ignore Cloudinary deletion errors
                }
            }
        }

        // Delete the application from DB
        await Application.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
        console.error("Error deleting application:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getUserProfile,
    updateProfile,
    getAllCompanies,
    applyToCompany,
    getMyApplications,
    updateDefaultResume,
    deleteApplicationById,
    upload // Export multer instance for use in routes
};