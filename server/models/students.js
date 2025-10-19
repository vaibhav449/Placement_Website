// student model
const mongoose=require("mongoose");

const studentSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,    
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:["student","coordinator"]
    },
    details:{
        rollNo:{
            type:String,
        },
        semester:{
            type:String,
        },
        course:{
            type:String,
        },
        graduationYear:{
            type:Number,
        },
        cgpa: {
            type: Number,
        },
        activeBacklogs: {
            type: Number,
        },
        branch: {
            type: String, },

        year:{
            type: String,
        }
    },
        
    defaultResume:{
        type:String,
    },
    profileIsCompleted:{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

studentSchema.pre('save', function(next) {
    const details = this.details || {};
    // Ensure details is attached to the document
    if (!this.details || typeof this.details !== 'object') {
        this.details = details;
    }

    // Derive batch from the first 4 characters of the email (e.g., 'cs23')
    if (typeof this.email === 'string' && this.email.length >= 4) {
        details.branch = this.email.slice(0, 2);
        details.year = this.email.slice(2, 4);
    }

    this.profileIsCompleted =
        !!this.name &&
        !!this.email &&
        !!this.password &&
        !!this.role &&
        !!details.rollNo &&
        !!details.semester &&
        !!details.course &&
        !!details.graduationYear &&
        typeof details.cgpa === 'number' &&
        typeof details.activeBacklogs === 'number' &&
        !!this.defaultResume;

    next();
});

const Student=mongoose.model("Student",studentSchema);
module.exports=Student;
