const mongoose=require("mongoose");

const companySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    package: {
        type: Number
    },
    skills: [{
        type: String
    }],
    requirements: {
        type: String
    },
    deadline: {
        type: Date
    },
    role: {
        type: String
    },
    type: {
        type: String,
        enum: ["Remote", "Onsite", "Hybrid"]
    },
    requiredCgpa: {
        type: Number,
        default: 0.0
    },
    applyLink: {
        type: String,
        required: true
    },
    isOnCampus: {
        type: Boolean,
        default: false
    }
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
