import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Applications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                if (!user?.enrollmentNo) return; // Prevent API call if user is undefined
                
                const response = await fetch(`${BASE_URL}/applications/student/${user.enrollmentNo}`);
                if (!response.ok) throw new Error("Failed to fetch applications");

                const data = await response.json();
                console.log("API Response Data:", data); // Debugging
                setApplications(data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false); // Stop loading indicator
            }
        };

        fetchApplications();
    }, [user]);

    if (loading) {
        return <p className="text-center mt-10 text-gray-500">Loading applications...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-20 p-6">
            <h2 className="text-3xl font-bold text-purple-700 mb-6">My Applications</h2>

            {applications.length === 0 ? (
                <p className="text-center text-gray-500">No applications found.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {applications.map((app) => (
                        <div key={app.jobId?._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-semibold text-gray-800">{app.jobId?.title || "N/A"}</h3>
                                <span className={`px-4 py-1 text-sm font-semibold rounded-full ${
                                    app.status === "applied" ? "bg-yellow-100 text-yellow-700" :
                                    app.status === "selected" ? "bg-green-100 text-green-700" :
                                    "bg-red-100 text-red-700"
                                }`}>
                                    {app.status || "N/A"}
                                </span>
                            </div>

                            <p className="text-lg text-gray-600 mt-2">{app.jobId?.company || "N/A"}</p>

                            <div className="flex items-center gap-6 mt-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">📍</span>
                                    <p className="text-gray-700">{app.jobId?.location || "N/A"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">💰</span>
                                    <p className="text-green-700 font-semibold">{app.jobId?.salary ? `${app.jobId.salary} LPA` : "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;
