import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ jobs: 0, applications: 0, students: 0 });
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedApplicants, setSelectedApplicants] = useState([]);  // Ensuring it's an array

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const jobRes = await fetch("http://localhost:4000/api/jobs");
                const jobData = await jobRes.json();
                setJobs(jobData);
                setStats((prev) => ({ ...prev, jobs: jobData.length }));

                const appRes = await fetch("http://localhost:4000/api/applications");
                const appData = await appRes.json();
                console.log(appData.length);
                setApplications(appData);
                setStats((prev) => ({ ...prev, applications: appData.length }));

                const studentRes = await fetch("http://localhost:4000/api/student");
                const studentData = await studentRes.json();
                setStats((prev) => ({ ...prev, students: studentData.length }));

                const selectedRes = await fetch("http://localhost:4000/api/student/selected");
                const selectedData = await selectedRes.json();
                setSelectedApplicants(Array.isArray(selectedData) ? selectedData : []); // Ensure it's an array
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className='max-w-6xl mx-auto mt-20 p-6'>
            <h2 className='text-3xl font-bold'>Admin Dashboard</h2>
            <p className='text-gray-500 mt-1'>Welcome (Admin)</p>

            {/* Stats Section */}
            <div className='grid grid-cols-3 gap-6 mt-6'>
                {[
                    { label: "Total Jobs", count: stats.jobs, color: "bg-blue-500" },
                    { label: "Total Applications", count: stats.applications, color: "bg-green-500" },
                    { label: "Total Students", count: stats.students, color: "bg-purple-500" },
                ].map((stat, index) => (
                    <div key={index} className={`p-4 text-white rounded-md shadow-md ${stat.color}`}>
                        <h3 className='text-lg'>{stat.label}</h3>
                        <p className='text-2xl font-bold'>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Recent Jobs Section */}
            <div className='mt-10'>
                <h3 className='text-xl font-semibold'>Recent Job Listings</h3>
                <div className='bg-white shadow-md rounded-md p-4 mt-2'>
                    <table className='w-full text-left'>
                        <thead className="bg-purple-200">
                            <tr className='border-b'>
                                <th className='p-2'>Company</th>
                                <th className='p-2'>Job Title</th>
                                <th className='p-2'>Location</th>
                            </tr>
                        </thead>

                        <tbody>
                            {jobs.slice(0, 5).map((job) => (
                                <tr key={job._id} className='border-b'>
                                    <td className='p-2'>{job.company}</td>
                                    <td className='p-2'>{job.title}</td>
                                    <td className='p-2'>{job.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Selected Applicants Section */}
            <div className='mt-10'>
                <h3 className='text-xl font-semibold'>Recent Selected Applicants</h3>
                <div className='bg-white shadow-md rounded-md p-4 mt-2'>
                    <table className='w-full text-left'>
                        <thead className="bg-purple-200">
                            <tr className='border-b'>
                                <th className='p-2'>Enrollment No</th>
                                <th className='p-2'>Name</th>
                                <th className='p-2'>Department</th>
                                <th className='p-2'>Company</th>
                                <th className='p-2'>Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedApplicants.length > 0 ? (
                                selectedApplicants.map((app) => (
                                    <tr key={app.enrollmentNo} className='border-b'>
                                        <td className='p-2'>{app.enrollmentNo}</td>
                                        <td className='p-2'>{app.name}</td>
                                        <td className='p-2'>{app.branch}</td>
                                        <td className='p-2'>{app.company}</td>
                                        <td className='p-2'>{app.salary}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-2 text-center">No selected applicants found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
