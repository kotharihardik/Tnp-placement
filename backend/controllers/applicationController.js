import Application from "../models/Application.js";
import Job from "../models/Job.js";


export const getApplication = async (req, res) => {
    try {
        const applications = await Application.find().sort({ _id: -1 }); // Sort by _id in descending order (latest first)
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error });
    }
};


// ✅ Apply for a job
export const applyJob = async (req, res) => {
    const { jobId, studentId } = req.body;

    if (!jobId || !studentId) {
        return res.status(400).json({ message: "Job ID and Student ID are required!" });
    }

    try {
        // Check if the student already applied
        const existingApplication = await Application.findOne({ jobId, studentId });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job!" });
        }

        // Create new application
        const application = new Application({ jobId, studentId });
        await application.save();

        res.status(201).json({ message: "Applied successfully!" });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// ✅ Get applications by student
export const getApplicationsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const applications = await Application.find({ studentId }).populate("jobId");

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get applications by job (for admin)
export const getApplicationsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ jobId }).populate("studentId"); // Populate student details

        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update application status (Admin only)
export const updateApplicationStatus = async (req, res) => {
    const { jobId, studentId, status } = req.body;

    try {
        const application = await Application.findOneAndUpdate({ jobId, studentId }, { status }, { new: true });

        if (!application) return res.status(404).json({ message: "Application not found" });

        res.json({ message: "Status updated successfully", application });
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Server error" });
    }
};
