import Job from "../models/Job.js";

export const createJob = async (req, res) => {
    try {
        const { title, company, location, description, branch, criteria, requirements, salary, deadline } = req.body;

        console.log("Received request body:", req.body); // Debugging step

        // ✅ Validate Required Fields
        if (!title || !company || !location || !description || !branch || !criteria || !requirements || !salary || !deadline) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Ensure `criteria.backlogs` is Defined
        if (criteria.backlogs === undefined || criteria.backlogs === null) {
            return res.status(400).json({ message: "Criteria.backlogs is required" });
        }

        // ✅ Convert and Validate Deadline
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
            return res.status(400).json({ message: "Invalid deadline format. Use YYYY-MM-DD." });
        }

        if (deadlineDate < new Date()) {
            return res.status(400).json({ message: "Deadline must be a future date" });
        }

        // ✅ Validate CGPA Range
        if (criteria.cgpa < 0 || criteria.cgpa > 10) {
            return res.status(400).json({ message: "CGPA must be between 0 and 10" });
        }

        // ✅ Validate Backlogs (Must be 0 or More)
        if (criteria.backlogs < 0) {
            return res.status(400).json({ message: "Backlogs must be 0 or greater" });
        }

        // ✅ Validate Salary (Must be Positive)
        if (salary <= 0) {
            return res.status(400).json({ message: "Salary must be a positive number" });
        }

        // ✅ Extract "value" from branch and requirements arrays
        const branchValues = branch.map((item) => item.value);
        const requirementValues = requirements.map((item) => item.value);

        // ✅ Save Job
        const job = new Job({
            title,
            company,
            location,
            description,
            branch: branchValues,
            criteria: {
                cgpa: criteria.cgpa,
                backlogs: criteria.backlogs !== undefined ? criteria.backlogs : 0, // Ensure default
            },
            requirements: requirementValues,
            salary,
            deadline: deadlineDate,
        });

        await job.save();
        res.status(201).json({ message: "Job created successfully", job });

    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


export const updateJob = async (req, res) => {
    try {
        const { id } = req.params; // Get the job ID from URL parameters
        const { title, company, location, description, branch, criteria, requirements, salary, deadline } = req.body;

        console.log("Received request body:", req.body); // Debugging step

        // ✅ Validate Required Fields
        if (!title || !company || !location || !description || !branch || !criteria || !requirements || !salary || !deadline) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Ensure `criteria.backlogs` is Defined
        if (criteria.backlogs === undefined || criteria.backlogs === null) {
            return res.status(400).json({ message: "Criteria.backlogs is required" });
        }

        // ✅ Convert and Validate Deadline
        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
            return res.status(400).json({ message: "Invalid deadline format. Use YYYY-MM-DD." });
        }

        if (deadlineDate < new Date()) {
            return res.status(400).json({ message: "Deadline must be a future date" });
        }

        // ✅ Validate CGPA Range
        if (criteria.cgpa < 0 || criteria.cgpa > 10) {
            return res.status(400).json({ message: "CGPA must be between 0 and 10" });
        }

        // ✅ Validate Backlogs (Must be 0 or More)
        if (criteria.backlogs < 0) {
            return res.status(400).json({ message: "Backlogs must be 0 or greater" });
        }

        // ✅ Validate Salary (Must be Positive)
        if (salary <= 0) {
            return res.status(400).json({ message: "Salary must be a positive number" });
        }

        // ✅ Extract "value" from branch and requirements arrays
        const branchValues = branch.map((item) => item.value);
        const requirementValues = requirements.map((item) => item.value);

        // ✅ Find the existing job and update
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        job.title = title;
        job.company = company;
        job.location = location;
        job.description = description;
        job.branch = branchValues;
        job.criteria = {
            cgpa: criteria.cgpa,
            backlogs: criteria.backlogs !== undefined ? criteria.backlogs : 0, // Ensure default
        };
        job.requirements = requirementValues;
        job.salary = salary;
        job.deadline = deadlineDate;

        // ✅ Save the updated job
        await job.save();
        res.status(200).json({ message: "Job updated successfully", job });

    } catch (error) {
        console.error("Error updating job:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};






export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ _id: -1 }); // Sort by _id in descending order (latest first)
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error });
    }
};

export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job", error });
    }
};

export const deleteJob = async (req, res) => {
    // we can delete all application also, that we didn't
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error });
    }
};
