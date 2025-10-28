const mongoose=require("mongoose");

const companySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    package: {
        type: Number,
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    requirements: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Remote", "Onsite", "Hybrid"],
        required: true
    },
    requiredCgpa: {
        type: Number,
        required: true,
        default: 0.0
    },
    applyLink: {
        type: String,
        required: true
    },
    isOnCampus: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
