// Dashboard stats controller
const Student = require('../models/students');
const Company = require('../models/companies');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const Application = require('../models/application');
const cloudinary = require('../utils/cloudinary');
const { getCloudinaryId } = require('../utils/helperPublicId');
const bcrypt = require('bcryptjs');

const getStats = async (req, res) => {
    try {
        const totalStudents = await require('../models/students').countDocuments();
        const totalCompanies = await require('../models/companies').countDocuments();
        const totalApplications = await require('../models/application').countDocuments();
        res.json({
            totalStudents,
            totalCompanies,
            totalApplications
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
// Register students from file (CSV or Excel)
const registerStudentsFromFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        
        let studentsData = [];

        if (fileExtension === 'csv') {
            // Parse CSV file
            studentsData = await parseCSVFile(filePath);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // Parse Excel file
            studentsData = parseExcelFile(filePath);
        } else {
            return res.status(400).json({ error: 'Unsupported file format. Please upload CSV or Excel file.' });
        }

        // Validate required fields for each student
        const validatedStudents = [];
        const errors = [];

        for (let i = 0; i < studentsData.length; i++) {
            const studentData = studentsData[i];
            
            // Check required fields
            if (!studentData.name || !studentData.email ) {
                errors.push(`Row ${i + 1}: Missing required fields (name, email)`);
                continue;
            }

            // Validate role
            if (!['student', 'coordinator'].includes(studentData.role)) {
                errors.push(`Row ${i + 1}: Invalid role. Must be 'student' or 'coordinator'`);
                continue;
            }

            // Create student object
            // Hash the password before saving
            const plainPassword = `${studentData.rollNo}@007`;
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            const student = {
                name: studentData.name,
                email: studentData.email,
                password: hashedPassword,
                role: studentData.role,
                details: {
                    rollNo: studentData.rollNo || '',
                    semester: studentData.semester || '',
                    course: studentData.course || '',
                    graduationYear: studentData.graduationYear ? parseInt(studentData.graduationYear) : null
                },
                defaultResume: studentData.defaultResume || ''
            };

            validatedStudents.push(student);
        }

        if (errors.length > 0) {
            return res.status(400).json({ 
                error: 'Validation errors found', 
                details: errors 
            });
        }

        // Insert students into database
        const insertResults = [];
        const insertErrors = [];

        for (let i = 0; i < validatedStudents.length; i++) {
            try {
                const newStudent = new Student(validatedStudents[i]);
                const savedStudent = await newStudent.save();
                insertResults.push({
                    email: savedStudent.email,
                    name: savedStudent.name,
                    status: 'success'
                });
            } catch (error) {
                insertErrors.push({
                    email: validatedStudents[i].email,
                    name: validatedStudents[i].name,
                    error: error.message,
                    status: 'failed'
                });
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: 'Student registration process completed',
            successful: insertResults.length,
            failed: insertErrors.length,
            results: insertResults,
            errors: insertErrors
        });

    } catch (error) {
        console.error('Error registering students from file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new company for placement
const createCompany = async (req, res) => {
    try {
        const {
            title,
            description,
            package: pkg,
            skills,
            requirements,
            deadline,
            role,
            type
        } = req.body;

        // Validate required fields
        if (!title || !description || !pkg || !skills || !requirements || !deadline || !role || !type) {
            return res.status(400).json({
                error: 'Missing required fields: title, description, package, skills, requirements, deadline, role, type are required.'
            });
        }

        // Validate type enum
        if (type && !['Remote', 'Onsite', 'Hybrid'].includes(type)) {
            return res.status(400).json({
                error: 'Invalid type. Must be one of: Remote, Onsite, Hybrid'
            });
        }

        // Validate package
        if (isNaN(pkg) || pkg < 0) {
            return res.status(400).json({
                error: 'Package must be a positive number'
            });
        }

        // Validate skills
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({
                error: 'Skills must be a non-empty array'
            });
        }

        // Check if company already exists by title
        const existingCompany = await Company.findOne({ title: title.trim() });
        if (existingCompany) {
            return res.status(409).json({
                error: 'Company with this title already exists'
            });
        }

        // Create company object
        const companyData = {
            title: title.trim(),
            description: description.trim(),
            package: parseFloat(pkg),
            skills: skills.map(s => s.trim()),
            requirements: requirements.trim(),
            deadline: new Date(deadline),
            role: role.trim(),
            type
        };

        // Save company to database
        const newCompany = new Company(companyData);
        const savedCompany = await newCompany.save();

        res.status(201).json({
            message: 'Company created successfully',
            company: savedCompany
        });

    } catch (error) {
        console.error('Error creating company:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ deadline: 1 });
        res.status(200).json({
            message: 'Companies retrieved successfully',
            count: companies.length,
            companies: companies
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a company
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            package: pkg,
            skills,
            requirements,
            deadline,
            role,
            type
        } = req.body;

        // Check if company exists
        const existingCompany = await Company.findById(id);
        if (!existingCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // Validate type enum if provided
        if (type && !['Remote', 'Onsite', 'Hybrid'].includes(type)) {
            return res.status(400).json({ error: 'Invalid type. Must be one of: Remote, Onsite, Hybrid' });
        }

        // Validate package if provided
        if (pkg !== undefined && (isNaN(pkg) || pkg < 0)) {
            return res.status(400).json({ error: 'Package must be a positive number' });
        }

        // Validate skills if provided
        if (skills && (!Array.isArray(skills) || skills.length === 0)) {
            return res.status(400).json({ error: 'Skills must be a non-empty array' });
        }

        // Check if title already exists (excluding current company)
        if (title && title.trim() !== existingCompany.title) {
            const duplicateCompany = await Company.findOne({
                title: title.trim(),
                _id: { $ne: id }
            });
            if (duplicateCompany) {
                return res.status(409).json({ error: 'Company with this title already exists' });
            }
        }

        // Build update object
        const updateData = {};
        if (title) updateData.title = title.trim();
        if (description) updateData.description = description.trim();
        if (pkg !== undefined) updateData.package = parseFloat(pkg);
        if (skills) updateData.skills = skills.map(s => s.trim());
        if (requirements) updateData.requirements = requirements.trim();
        if (deadline) updateData.deadline = new Date(deadline);
        if (role) updateData.role = role.trim();
        if (type) updateData.type = type;

        // Update company
        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Company updated successfully',
            company: updatedCompany
        });

    } catch (error) {
        console.error('Error updating company:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid company ID format' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a company
const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if company exists
        const existingCompany = await Company.findById(id);
        if (!existingCompany) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // Find all applications for this company and gather resume Cloudinary IDs
        const applications = await Application.find({ companyId: id }).select('resume');
        const idMap = new Map(); // publicId -> resourceType

        for (const app of applications) {
            if (!app?.resume) continue;
            const { publicId, resourceType } = getCloudinaryId(app.resume);
            // Extra safety: only delete from the intended folder
            if (publicId && publicId.startsWith('placement/resumes')) {
                idMap.set(publicId, resourceType || 'raw');
            }
        }

        // Delete resumes from Cloudinary (best-effort)
        let resumesDeleted = 0;
        const destroyTasks = Array.from(idMap.entries()).map(([publicId, resourceType]) =>
            cloudinary.uploader
                .destroy(publicId, { resource_type: resourceType })
                .then(r => {
                    if (r?.result === 'ok' || r?.result === 'not found') resumesDeleted++;
                })
                .catch(() => {
                    // Log error but continue
                    console.error(`Failed to delete Cloudinary resource: ${publicId}`);
                })
        );
        try {
            await Promise.allSettled(destroyTasks);
        } catch (err) {
            // Log but do not block deletion
            console.error('Error deleting resumes from Cloudinary:', err);
        }
        // Remove related applications
        const { deletedCount: applicationsDeleted = 0 } = await Application.deleteMany({ companyId: id });

        // Delete the company
        await Company.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Company deleted successfully',
            deletedCompany: {
                id: existingCompany._id,
                name: existingCompany.name
            },
            cleanup: {
                applicationsDeleted,
                resumesRequested: idMap.size,
                resumesDeleted
            }
        });
    } catch (error) {
        console.error('Error deleting company:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid company ID format' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single company by ID
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }
        res.status(200).json({
            message: 'Company retrieved successfully',
            company: company
        });
    } catch (error) {
        console.error('Error fetching company:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid company ID format' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Download all resumes as a zip from Cloudinary
const downloadAllResumesZip = async (req, res) => {
    try {
        // 1. Fetch all resume URLs from Application collection
        const applications = await Application.find({}).select('resume');
        if (!applications.length) {
            return res.status(404).json({ error: 'No resumes found.' });
        }

        // 2. Extract public IDs using your helper
        const resumePublicIds = [];
        for (const app of applications) {
            if (!app.resume) continue;
            const { publicId, resourceType } = getCloudinaryId(app.resume);
            // Only include resumes from the intended folder
            if (publicId && publicId.startsWith('placement/resumes')) {
                resumePublicIds.push(publicId);
            }
        }

        if (!resumePublicIds.length) {
            return res.status(404).json({ error: 'No valid resumes found in placement/resumes.' });
        }

        // 3. Generate the Cloudinary zip download URL
        const zipUrl = await cloudinary.utils.download_zip_url({
            public_ids: resumePublicIds,
            resource_type: 'raw', // PDFs and docs are 'raw'
            target_public_id: 'placement/all_resumes', // Optional: name of the zip in Cloudinary
        });

        // 4. Return the zip URL to the client
        return res.status(200).json({
            message: 'Download link generated successfully.',
            zipUrl
        });
    } catch (error) {
        console.error('Error generating resumes zip:', error);
        return res.status(500).json({ error: 'Failed to generate resumes zip.' });
    }
};

// Download all resumes for a specific company as a zip from Cloudinary
const downloadCompanyResumesZip = async (req, res) => {
    try {
        const { id: companyId } = req.params;

        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        // 1. Fetch all resume URLs for this company from Application collection
        const applications = await Application.find({ companyId }).select('resume');
        if (!applications.length) {
            return res.status(404).json({ error: 'No resumes found for this company.' });
        }

        // 2. Extract public IDs using your helper
        const resumePublicIds = [];
        for (const app of applications) {
            if (!app.resume) continue;
            const { publicId } = getCloudinaryId(app.resume);
            // Only include resumes from the intended folder
            if (publicId && publicId.startsWith('placement/resumes')) {
                resumePublicIds.push(publicId);
            }
        }

        if (!resumePublicIds.length) {
            return res.status(404).json({ error: 'No valid resumes found in placement/resumes for this company.' });
        }

        // 3. Generate the Cloudinary zip download URL
        const zipUrl = await cloudinary.utils.download_zip_url({
            public_ids: resumePublicIds,
            resource_type: 'raw', // PDFs and docs are 'raw'
            target_public_id: `placement/${company.name.replace(/\s+/g, '_')}_resumes`, // Optional: name of the zip in Cloudinary
        });

        // 4. Return the zip URL to the client
        return res.status(200).json({
            message: 'Download link generated successfully.',
            zipUrl
        });
    } catch (error) {
        console.error('Error generating company resumes zip:', error);
        return res.status(500).json({ error: 'Failed to generate resumes zip.' });
    }
};

// Helper function to parse CSV file
const parseCSVFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Helper function to parse Excel file
const parseExcelFile = (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Read rows; defval ensures empty cells become empty strings rather than undefined
    const rawRows = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

    // Helper to normalize and map multiple header variants to one field
    const pick = (raw, candidates = []) => {
        // exact match (case-insensitive, trim)
        for (const c of candidates) {
            const key = Object.keys(raw).find(k => k && k.toString().trim().toLowerCase() === c.toString().trim().toLowerCase());
            if (key && raw[key] !== '') return String(raw[key]).trim();
        }
        // fuzzy match: compare normalized keys (lowercase, remove non-alnum)
        const normMap = Object.keys(raw).reduce((acc, k) => {
            acc[k.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '')] = raw[k];
            return acc;
        }, {});
        for (const c of candidates) {
            const nc = c.toString().trim().toLowerCase().replace(/[^a-z0-9]/g, '');
            if (nc && normMap[nc] !== undefined && normMap[nc] !== '') return String(normMap[nc]).trim();
        }
        return '';
    };

    return rawRows.map(raw => {
        const name = pick(raw, ['name', 'full name', 'student name']);
        const email = pick(raw, ['email', 'e-mail', 'mail']);
        const rollNo = pick(raw, ['rollNo', 'roll no', 'roll', 'roll_number', 'rollno']);
        const roleRaw = pick(raw, ['role']);
        const role = (roleRaw || 'student').toString().trim().toLowerCase();
        const semester = pick(raw, ['semester', 'sem']);
        const course = pick(raw, ['course']);
        const graduationYearRaw = pick(raw, ['graduationYear', 'graduation year', 'graduation_year', 'graduation']);
        const graduationYear = graduationYearRaw ? parseInt(graduationYearRaw, 10) || null : null;
        const defaultResume = pick(raw, ['defaultResume', 'resume']);

        return {
            name,
            email,
            rollNo,
            role,
            semester,
            course,
            graduationYear,
            defaultResume
        };
    });
};

// Helper to escape user input used in RegExp
const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalize = (s = '') => s.toString().trim().toLowerCase().replace(/\s+/g, ' ');

// Promote a student to coordinator by email only
const makeStudentCoordinator = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Case-insensitive email match
    const emailRegex = new RegExp(`^${escapeRegex(email.toString().trim())}$`, 'i');
    const student = await Student.findOne({ email: emailRegex });

    if (!student) {
      return res.status(404).json({ error: 'Student not found with provided email' });
    }

    if (student.role === 'coordinator') {
      return res.status(400).json({ error: 'User is already a coordinator' });
    }

    student.role = 'coordinator';
    await student.save();

    return res.status(200).json({
      message: 'Student promoted to coordinator successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      }
    });
  } catch (error) {
    console.error('Error promoting student:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password'); // Exclude password field
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

module.exports = {
    registerStudentsFromFile,
    createCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany,
    getCompanyById,
    downloadAllResumesZip,
    downloadCompanyResumesZip,
    makeStudentCoordinator,
    getStats,
    getAllStudents
};