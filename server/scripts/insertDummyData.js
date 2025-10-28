require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Company = require('../models/companies');
const Student = require('../models/students');

// Helper to create dummy companies
async function createDummyCompanies(n = 20) {
    const types = ['Remote', 'Onsite', 'Hybrid'];
    const skillsList = [
        ['JavaScript', 'React', 'Node.js'],
        ['Python', 'Django', 'REST'],
        ['Java', 'Spring', 'Microservices'],
        ['C++', 'Algorithms', 'DSA'],
        ['SQL', 'MongoDB', 'Express']
    ];
    for (let i = 0; i < n; i++) {
        const company = new Company({
            title: `Company ${i + 1}`,
            description: `Description for Company ${i + 1}`,
            package: Math.floor(Math.random() * 30) + 10,
            skills: skillsList[i % skillsList.length],
            requirements: `Requirements for Company ${i + 1}`,
            deadline: new Date(Date.now() + (i + 1) * 86400000),
            role: ['SDE', 'Backend', 'Frontend', 'DevOps', 'Data Scientist'][i % 5],
            type: types[i % types.length],
            requiredCgpa: (Math.random() * 3 + 6).toFixed(2),
            applyLink: `https://company${i + 1}.com/apply`,
            isOnCampus: i % 2 === 0
        });
        await company.save();
    }
}

// Helper to create dummy students with hashed passwords
async function createDummyStudents(n = 50) {
    const branches = ['cs23', 'mc22', 'ai21', 'cs22', 'mc21'];
    for (let i = 0; i < n; i++) {
        const plainPassword = `hashedpassword`;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const student = new Student({
            name: `Student ${i + 1}`,
            email: `${branches[i % branches.length]}b${1000 + i}@iiitr.ac.in`,
            password: hashedPassword,
            role: 'student',
            details: {
                rollNo: `R${1000 + i}`,
                semester: `${(i % 8) + 1}`,
                course: ['BTech', 'MTech', 'PhD'][i % 3],
                graduationYear: 2025 + (i % 3),
                cgpa: (Math.random() * 3 + 6).toFixed(2),
                activeBacklogs: i % 2,
                branch: '', // will be set by pre-save hook
                year: ''    // will be set by pre-save hook
            },
            defaultResume: null,
            profileIsCompleted: false
        });
        await student.save();
    }
}

// Run function to seed data
async function run() {
    const MONGODB_URI = process.env.MONGODB_URI
        || process.env.MONGODB_URL
        || process.env.MONGO_URI
        || process.env.MONGO_URL
        || process.env.DATABASE_URL
        || process.env.MONGO_URL;

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await createDummyCompanies(20);
        console.log('Dummy companies inserted');

        await createDummyStudents(50);
        console.log('Dummy students inserted');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error inserting dummy data:', err);
        process.exit(1);
    }
}

run();