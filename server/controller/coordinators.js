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
const fetch = require('node-fetch');

const getStats = async (req, res) => {
    try {
        const totalStudents = await require('../models/students').countDocuments();
        const totalCompanies = await require('../models/companies').countDocuments();
        const totalApplications = await require('../models/application').countDocuments();
        return res.json({
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
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        const isBuffer = !!req.file.buffer;
        const filePath = req.file.path; // may be undefined with memoryStorage

        let studentsData = [];

        if (fileExtension === 'csv') {
            // Parse CSV file (support buffer or path)
            if (isBuffer) {
                studentsData = await parseCSVBuffer(req.file.buffer);
            } else {
                studentsData = await parseCSVFile(filePath);
            }
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            // Parse Excel file (support buffer)
            if (isBuffer) {
                studentsData = parseExcelBuffer(req.file.buffer);
            } else {
                studentsData = parseExcelFile(filePath);
            }
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
                    graduationYear: studentData.graduationYear ? parseInt(studentData.graduationYear, 10) : null,
                    cgpa: studentData.cgpa !== undefined && studentData.cgpa !== '' ? parseFloat(studentData.cgpa) : null,
                    activeBacklogs: studentData.activeBacklogs !== undefined && studentData.activeBacklogs !== '' ? parseInt(studentData.activeBacklogs, 10) : null,
                    branch: studentData.branch || '',
                    year: studentData.year || ''
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

        // If disk path exists, remove it. If using memoryStorage there's nothing to unlink.
        if (filePath) {
            try { fs.unlinkSync(filePath); } catch {}
        }

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
        console.log("Creating company with data:", req.body);
        const {
            title,
            description,
            package: pkg,
            skills,
            requirements,
            deadline,
            role,
            type,
            requiredCgpa,
            applyLink,
            isOnCampus
        } = req.body;

        // Only title and applyLink are required
        if (!title || !applyLink) {
            return res.status(400).json({
                error: 'Missing required fields: title and applyLink are required.'
            });
        }

        // Validate type enum if provided
        if (type && !['Remote', 'Onsite', 'Hybrid'].includes(type)) {
            return res.status(400).json({
                error: 'Invalid type. Must be one of: Remote, Onsite, Hybrid'
            });
        }

        // Validate package if provided
        if (pkg !== undefined && pkg !== '' && (isNaN(pkg) || pkg < 0)) {
            return res.status(400).json({
                error: 'Package must be a positive number'
            });
        }

        // Validate requiredCgpa if provided
        if (requiredCgpa !== undefined && requiredCgpa !== '' && (isNaN(requiredCgpa) || requiredCgpa < 0 || requiredCgpa > 10)) {
            return res.status(400).json({
                error: 'requiredCgpa must be a number between 0 and 10'
            });
        }

        // Validate skills if provided
        let skillsArray = [];
        if (skills !== undefined) {
            if (!Array.isArray(skills)) {
                return res.status(400).json({
                    error: 'Skills must be an array'
                });
            }
            skillsArray = skills.map(s => s.trim());
        }

        // Validate isOnCampus if provided
        let isOnCampusValue = false;
        if (isOnCampus !== undefined) {
            if (typeof isOnCampus !== 'boolean') {
                return res.status(400).json({
                    error: 'isOnCampus must be a boolean'
                });
            }
            isOnCampusValue = isOnCampus;
        }

        // Check if company already exists by title
        const existingCompany = await Company.findOne({ title: title.trim() });
        if (existingCompany) {
            return res.status(409).json({
                error: 'Company with this title already exists'
            });
        }

        // Create company object (only set fields if provided)
        const companyData = {
            title: title.trim(),
            applyLink: applyLink.trim()
        };
        if (description !== undefined && description !== '') companyData.description = description.trim();
        if (pkg !== undefined && pkg !== '') companyData.package = parseFloat(pkg);
        if (skills !== undefined) companyData.skills = skillsArray;
        if (requirements !== undefined && requirements !== '') companyData.requirements = requirements.trim();
        if (deadline !== undefined && deadline !== '') companyData.deadline = new Date(deadline);
        if (role !== undefined && role !== '') companyData.role = role.trim();
        if (type !== undefined && type !== '') companyData.type = type;
        if (requiredCgpa !== undefined && requiredCgpa !== '') companyData.requiredCgpa = parseFloat(requiredCgpa);
        companyData.isOnCampus = isOnCampusValue;

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

// Download resumes based on filters (batch and/or company)
// const downloadFilteredResumesZip = async (req, res) => {
//     try {
//         const { batch, company } = req.query;
//         console.log('Download filtered resumes for batch:', batch, 'company:', company);

//         let resumePublicIds = [];

//         if (!batch && !company) {
//             const students = await Student.find({ defaultResume: { $exists: true, $ne: '' } }).select('defaultResume');
//             for (const student of students) {
//                 if (!student.defaultResume) continue;
//                 const { publicId } = getCloudinaryId(student.defaultResume);
//                 // Only push if publicId is valid and not empty
//                 if (publicId && publicId.startsWith('placement/resumes')) {
//                     resumePublicIds.push(publicId);
//                 }
//             }
//             // Remove duplicates and empty IDs
//             resumePublicIds = resumePublicIds.filter(Boolean);
//         } else {
//             let studentFilter = {};
//             if (batch) studentFilter['details.year'] = batch;

//             let studentIds = [];
//             if (batch) {
//                 const students = await Student.find(studentFilter).select('_id');
//                 studentIds = students.map(s => s._id);
//             }

//             let appFilter = {};
//             if (company) appFilter.companyId = company;
//             if (studentIds.length > 0) appFilter.studentId = { $in: studentIds };

//             const applications = await Application.find(appFilter).select('resume');
//             for (const app of applications) {
//                 if (!app.resume) continue;
//                 const { publicId } = getCloudinaryId(app.resume);
//                 if (publicId && publicId.startsWith('placement/resumes')) {
//                     resumePublicIds.push(publicId);
//                 }
//             }
//         }

//         if (!resumePublicIds.length) {
//             console.error('No valid resumes found for download.');
//             return res.status(404).json({ error: 'No valid resumes found.' });
//         }

//         // Generate Cloudinary ZIP URL
//         let zipUrl;
//         try {
//             // Helper to check if a publicId exists in Cloudinary
//             async function cloudinaryExists(publicId) {
//                 try {
//                     const result = await cloudinary.api.resource(publicId + '.pdf', { resource_type: 'raw' });
//                     return !!result;
//                 } catch (err) {
//                     return false;
//                 }
//             }

//             const validResumePublicIds = [];
//             for (const publicId of resumePublicIds) {
//                 if (await cloudinaryExists(publicId)) {
//                     validResumePublicIds.push(publicId + '.pdf');
//                 }
//             }

//             zipUrl = await cloudinary.utils.download_zip_url({
//                 public_ids: validResumePublicIds,
//                 resource_type: 'raw',
//                 target_public_id: 'placement/filtered_resumes'
//             });
//         } catch (cloudErr) {
//             console.error('Cloudinary ZIP generation error:', cloudErr);
//             return res.status(500).json({ error: 'Failed to generate ZIP from Cloudinary.' });
//         }

//         // Proxy the ZIP file as a blob
//         let response;
//         try {
//             response = await fetch(zipUrl);
//         } catch (fetchErr) {
//             console.error('Fetch error:', fetchErr);
//             return res.status(500).json({ error: 'Failed to fetch ZIP from Cloudinary.' });
//         }
//         if (!response.ok) {
//             console.error('Cloudinary responded with error:', await response.text());
//             return res.status(500).json({ error: 'Failed to fetch ZIP from Cloudinary.' });
//         }
//         res.setHeader('Content-Disposition', 'attachment; filename="resumes.zip"');
//         res.setHeader('Content-Type', 'application/zip');
//         response.body.pipe(res);
//     } catch (error) {
//         console.error('Error downloading filtered resumes:', error.stack || error);
//         res.status(500).json({ error: 'Failed to download resumes.' });
//     }
// };

const downloadFilteredResumesZip = async (req, res) => {
  try {
    const { batch, company } = req.query;
    console.log('Download filtered resumes for batch:', batch, 'company:', company);

    let resumePublicIds = [];

    if (!batch && !company) {
      const students = await Student.find({ defaultResume: { $exists: true, $ne: '' } })
        .select('defaultResume');
      for (const student of students) {
        if (!student.defaultResume) continue;
        const { publicId } = getCloudinaryId(student.defaultResume);
        if (publicId && publicId.startsWith('placement/resumes')) {
          resumePublicIds.push(publicId); // NOTE: no ".pdf"
        }
      }
    } else {
      const studentFilter = {};
      if (batch) studentFilter['details.year'] = batch;

      let studentIds = [];
      if (batch) {
        const students = await Student.find(studentFilter).select('_id');
        studentIds = students.map(s => s._id);
      }

      const appFilter = {};
      if (company) appFilter.companyId = company;
      if (studentIds.length > 0) appFilter.userId = { $in: studentIds };
      console.log('Application filter:', appFilter);
      const applications = await Application.find(appFilter).select('resume');
      console.log('Found applications:', applications.length);
      for (const app of applications) {
        if (!app.resume) continue;
        const { publicId } = getCloudinaryId(app.resume);
        if (publicId && publicId.startsWith('placement/resumes')) {
          resumePublicIds.push(publicId); // NOTE: no ".pdf"
        }
      }
    }

    // De-dupe + sanity check
    resumePublicIds = Array.from(new Set(resumePublicIds)).filter(Boolean);
    if (!resumePublicIds.length) {
      console.error('No candidate resumes found for download.');
      return res.status(404).json({ error: 'No valid resumes found.' });
    }

    // Pick the correct resource_type for PDFs: usually 'image'
    const RESOURCE_TYPE = 'raw'; // change to 'raw' only if you truly uploaded resumes as raw

    // Helper: check existence using the correct resource_type and no extension
    async function cloudinaryExists(publicId) {
      try {
        const result = await cloudinary.api.resource(publicId, { resource_type: RESOURCE_TYPE });
        return !!result;
      } catch {
        return false;
      }
    }

    // Validate in parallel (faster)
    const existence = await Promise.all(resumePublicIds.map(id => cloudinaryExists(id)));
    const validResumePublicIds = resumePublicIds.filter((_, i) => existence[i]);

    if (!validResumePublicIds.length) {
      console.error('All candidate resumes were missing/mismatched type on Cloudinary.');
      return res.status(404).json({ error: 'No resumes available to zip.' });
    }

    // Build the ZIP (no extensions in public_ids)
    let zipUrl;
    try {
      zipUrl = await cloudinary.utils.download_zip_url({
        public_ids: validResumePublicIds,
        resource_type: RESOURCE_TYPE,
        target_public_id: 'placement/filtered_resumes',
        type: 'upload', // usually correct; include if you used non-default delivery type
      });
    } catch (cloudErr) {
      console.error('Cloudinary ZIP generation error:', cloudErr);
      return res.status(500).json({ error: 'Failed to generate ZIP from Cloudinary.' });
    }

    // Stream the ZIP back
    let response;
    try {
      response = await fetch(zipUrl);
    } catch (fetchErr) {
      console.error('Fetch error:', fetchErr);
      return res.status(500).json({ error: 'Failed to fetch ZIP from Cloudinary.' });
    }

    if (!response.ok) {
      console.error('Cloudinary responded with error:', await response.text());
      return res.status(500).json({ error: 'Failed to fetch ZIP from Cloudinary.' });
    }

    res.setHeader('Content-Disposition', 'attachment; filename="resumes.zip"');
    res.setHeader('Content-Type', 'application/zip');
    response.body.pipe(res);
  } catch (error) {
    console.error('Error downloading filtered resumes:', error.stack || error);
    res.status(500).json({ error: 'Failed to download resumes.' });
  }
};


// Parse CSV from Buffer
const parseCSVBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const streamifier = require('streamifier');
        streamifier.createReadStream(buffer)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Parse Excel from Buffer
const parseExcelBuffer = (buffer) => {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawRows = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    // reuse the existing pick/normalization mapping code by reconstructing same mapping logic:
    // (copy of code used in parseExcelFile's mapping)
    const pick = (raw, candidates = []) => {
        for (const c of candidates) {
            const key = Object.keys(raw).find(k => k && k.toString().trim().toLowerCase() === c.toString().trim().toLowerCase());
            if (key && raw[key] !== '') return String(raw[key]).trim();
        }
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
        // console.log("Fetched students:", students);
       return res.json({    
            message: 'Students fetched successfully',
            count: students.length,
            students: students
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
};

// write a function to get all applications
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({ path: 'userId', select: 'name email' })
            .populate({ path: 'companyId', select: 'title _id' });

        // Map applications to include username and company name
        const mappedApplications = applications.map(app => ({
            _id: app._id,
            userName: app.userId?.name || '',
            userEmail: app.userId?.email || '',
            companyName: app.companyId?.title || '',
            resume: app.resume,
            status: app.status,
            createdAt: app.createdAt,
            companyId: app.companyId?._id || '',
        }));
        return res.json({
            message: 'Applications fetched successfully',
            count: mappedApplications.length,
            applications: mappedApplications
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applications' });
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
    getAllStudents,
    downloadFilteredResumesZip,
    getAllApplications
};