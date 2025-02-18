import Application from "../models/Application.js";
import Student from "../models/Student.js";
import Job from "../models/Job.js";

export const getStudentAnalytics = async (req, res) => {
    try {
        const { enrollmentNo } = req.params;

        // Application Status Breakdown
        const applicationStatus = await Application.aggregate([
            { $match: { studentId: enrollmentNo } }, // Match the student by their enrollment number
            { $group: { _id: "$status", count: { $sum: 1 } } } // Group by application status and count
        ]);

        const applicationTrends = await Job.aggregate([
            {
                $addFields: {
                    deadline: { $toDate: "$deadline" }  // Convert 'deadline' to Date type
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$deadline" },  // Extract the year from the deadline
                        month: { $month: "$deadline" }, // Extract the month from the deadline
                    },
                    count: { $sum: 1 },  // Count the number of applications for each month/year
                },
            },
            { 
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month ascending
            },
        ]);
        

        // Branch Count (students by branch)
        const branchCounts = await Student.aggregate([
            { $unwind: "$branch" }, // Unwind the branch array to handle multiple branches per student
            { $match: { branch: { $ne: "ALL" } } }, // Exclude "ALL" from the branches
            { $group: { _id: "$branch", count: { $sum: 1 } } }, // Group by branch and count students
            { $sort: { count: -1 } } // Sort by count in descending order
        ]);

        const placementRates = await Application.aggregate([
            {
                $lookup: {
                    from: "students", 
                    localField: "studentId",
                    foreignField: "enrollmentNo", 
                    as: "studentDetails",
                },
            },
            {
                $unwind: "$studentDetails", // Unwind the studentDetails to get individual student data
            },
            // Group by the application status to count the students in each status
            {
                $group: {
                    _id: "$status", // Group by application status (applied, shortlisted, selected, rejected)
                    count: { $sum: 1 }, // Count the number of students in each application status
                },
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id", // Rename _id to status (applied, shortlisted, selected, rejected)
                    count: 1, // Include count for each status
                },
            },
            // Optionally, sort by application status or count
            {
                $sort: {
                    status: 1, // Sort statuses if needed
                },
            },
        ]);
        
        const cgpaDistribution = await Student.aggregate([
            // Group students by CGPA ranges (you can adjust the ranges as needed)
            {
                $bucket: {
                    groupBy: "$cgpa", // Assuming the student has a "cgpa" field
                    boundaries: [0, 4, 6, 8, 10], // Define the CGPA ranges
                    default: "Others", // Default category for CGPAs outside the defined ranges
                    output: {
                        count: { $sum: 1 }, // Count the number of students in each range
                    },
                },
            },
            // Optionally, sort by CGPA range or count (you can change sorting if required)
            {
                $sort: { "_id": 1 }, // Sort by CGPA range in ascending order
            },
        ]);
        
 
        
        
        

        // Return all the analytics data
        res.json({
            applicationStatus,
            applicationTrends,
            cgpaDistribution,
            branchCounts,
            placementRates,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message, hello: "Some value" });
    }
    
};
