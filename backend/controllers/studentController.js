import Student from "../models/Student.js";
import Application from "../models/Application.js";


export const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ _id: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error });
    }
};



// // Update student details
// export const updateStudent = async (req, res) => {
//     try {
//         const student = await Student.findOneAndUpdate({ enrollmentNo: req.params.enrollmentNo }, req.body, { new: true });
//         if (!student) {
//             return res.status(404).json({ message: "Student not found" });
//         }
//         res.json({ message: "Student updated successfully", student });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating student", error });
//     }
// };

// Update student details (with file upload)
export const updateStudent = async (req, res) => {
    try {
        const updatedData = req.body;  // This contains the student data (excluding the file)

        // Check if the file is uploaded and add it to updatedData
        if (req.file) {
            updatedData.resumeLink = req.file.path;  // Add the file path to the student data
        }

        console.log(updatedData);  // Check if the file is being uploaded correctly

        // Update student record in the database
        const student = await Student.findOneAndUpdate(
            { enrollmentNo: req.params.enrollmentNo }, // Find student by enrollment number
            updatedData, // Updated data
            { new: true }  // Return the updated document
        );

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated successfully", student });
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ message: "Error updating student", error });
    }
};






// Get a specific student by enrollment number
export const getStudentByEnrollmentNo = async (req, res) => {
    try {
        const student = await Student.findOne({ enrollmentNo: req.params.enrollmentNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error });
    }
};



export const getSelectedApplicants = async (req, res) => {
    try {
        // Fetch selected applications with job details
        const selectedApplications = await Application.find({ status: "selected" })
            .populate("jobId", "company salary") // Ensure `jobId` exists
            .lean();

        if (!selectedApplications.length) {
            return res.json({ message: "No selected applicants found." });
        }

        // Extract student IDs (ensure correct format)
        const studentIds = selectedApplications
            .map(app => app.studentId?.toString()) // Convert ObjectId to string if needed
            .filter(id => id); // Remove any undefined/null values

        // Fetch student details
        const students = await Student.find({ enrollmentNo: { $in: studentIds } })
            .select("enrollmentNo branch name")
            .lean();

        if (!students.length) {
            console.warn("⚠️ Warning: No matching students found for selected applications.");
        }

        // Merge student data with applications
        const finalData = selectedApplications.map(app => {
            const student = students.find(stu => stu.enrollmentNo === app.studentId?.toString());
            return {
                enrollmentNo: student?.enrollmentNo || "N/A",
                name: student?.name || "N/A",
                branch: student?.branch || "N/A",
                company: app.jobId?.company || "N/A",
                salary: app.jobId?.salary || "N/A",
            };
        });

        res.json(finalData);
    } catch (error) {
        console.error("Error fetching selected applicants:", error);
        res.status(500).json({ message: "Error fetching selected applicants", error: error.message });
    }
};


export const getStudentsByBranch = async (req, res) => {
    try {
        // Fetch all students
        const students = await Student.find().sort({ _id: -1 });

        // Initialize an object to hold branch counts
        const branchCounts = {};

        // Iterate over each student to count the branches
        students.forEach(student => {
            // Check if the student has a valid branch field
            if (student.branch && student.branch.length > 0) {
                // Loop over each branch the student belongs to
                student.branch.forEach(branch => {
                    if (branch !== "ALL") {
                        branchCounts[branch] = (branchCounts[branch] || 0) + 1; // Increment count for this branch
                    }
                });
            }
        });

        // Transform the branchCounts object into an array of { branch, count }
        const branchData = Object.keys(branchCounts).map(branch => ({
            branch,
            count: branchCounts[branch],
        }));

        // Send the branch data as response
        res.json(branchData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching branch data", error });
    }
};
