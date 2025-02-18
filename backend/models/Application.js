import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    studentId: { type: String, required: true }, // Change ObjectId to String for enrollmentNo
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["applied", "shortlisted", "selected", "rejected"], default: "applied" },
});

export default mongoose.model("Application", applicationSchema);
