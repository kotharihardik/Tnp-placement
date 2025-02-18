import mongoose from "mongoose";

// student profile
const studentSchema = new mongoose.Schema({
    enrollmentNo: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    gender: String,
    graduationYear: Number,
    branch: String,
    dob: Date,
    email: { type: String, required: true },
    phone: Number,
    cgpa: Number,
    backlogHistory: Number,
    liveBacklog: Number,
    resumeLink: String,
    linkedinLink: String,
});

export default mongoose.model("Student", studentSchema);
