// Dashboard stats route
const express = require('express');
const router = express.Router();
// reuse the multer instance (memoryStorage) exported by students controller
const { upload } = require('../controller/students');
 
const {
    registerStudentsFromFile,
    createCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany,
    getCompanyById,
    downloadAllResumesZip,
    downloadCompanyResumesZip,
    makeStudentCoordinator,
    getAllStudents
} = require('../controller/coordinators');

// combine middleware imports and remove unused ones
const { authenticate, requireCoordinator } = require("../middleware/auth");

// Apply authentication and coordinator check to all coordinator routes
router.use(authenticate, requireCoordinator);

// Coordinator endpoints (now protected)    
// add upload middleware for file upload route
router.get('/stats', require('../controller/coordinators').getStats);
router.post('/register-students-file', upload.single('file'), registerStudentsFromFile);
router.post('/companies', createCompany);
router.get('/companies', getAllCompanies);
router.get('/companies/:id', getCompanyById);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);
router.get('/resumes/download-all', downloadAllResumesZip);
router.get('/resumes/download/:id', downloadCompanyResumesZip);
router.get('/resumes/download', require('../controller/coordinators').downloadFilteredResumesZip);
// router.put('/promote', makeStudentCoordinator);
router.get("/students", getAllStudents);
router.get("/applications", require('../controller/coordinators').getAllApplications);
module.exports = router;