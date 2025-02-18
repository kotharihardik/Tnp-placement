import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    branch: { type: [String], required: true, default: ["ALL"] },
    criteria: { 
      cgpa: { type: Number, required: true, min: 0, max: 10 },
      backlogs: { type: Number, required: true, default: 0, min: 0 },
    },
    requirements: { type: [String], required: true },
    salary: { type: Number, required: true, min: 0 }, 
    deadline: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model("Job", jobSchema);
