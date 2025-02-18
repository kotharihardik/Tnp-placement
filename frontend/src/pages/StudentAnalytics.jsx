import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";
import { Doughnut } from 'react-chartjs-2';
import { useAuth } from "../context/AuthContext";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from "chart.js";

// ✅ **Register required Chart.js components**
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const BASE_URL = import.meta.env.VITE_BASE_URL;

const StudentAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const enrollmentNo = user?.enrollmentNo;

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/analytics/student/${enrollmentNo}`);
                setAnalytics(response.data);
                // console.log(response.data);
                // console.log("Raw applicationTrends:", analytics);
                // console.log("Sorted Trends:", sortedTrends); 

            } catch (err) {
                setError("Failed to load analytics.");
            } finally {
                setLoading(false);
            }
        };

        if (enrollmentNo) {
            fetchAnalytics();
        }
    }, [enrollmentNo]);



    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p>{error}</p>;
    if (!analytics) return <p>No analytics data available.</p>;


    //Bar chart
    // Prepare the application counts for the Bar Chart (Application Status)
    const applicationCounts = {
        applied: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0,
    };
    analytics.applicationStatus.forEach(item => {
        applicationCounts[item._id] = item.count;
    });
    const applicationStatusData = {
        labels: ["Applied", "Shortlisted", "Selected", "Rejected"],
        datasets: [
            {
                label: "Job Applications",
                data: [
                    applicationCounts.applied,
                    applicationCounts.shortlisted,
                    applicationCounts.selected,
                    applicationCounts.rejected,
                ],
                backgroundColor: ["blue", "orange", "green", "red"],
            },
        ],
    };



    // Pie Chart - Jobs by Branch
    const branchCounts = analytics.branchCounts;
    const pieChartData = {
        labels: branchCounts.map(branch => branch._id),
        datasets: [
            {
                data: branchCounts.map(branch => branch.count),
                backgroundColor: [
                    "#FF5722", // Deep Orange
                    "#4CAF50", // Green
                    "#2196F3", // Blue
                    "#FFC107", // Amber
                    "#00BCD4"  // Cyan (replacing purple)
                ],
                hoverBackgroundColor: [
                    "#E64A19", // Darker Deep Orange
                    "#388E3C", // Darker Green
                    "#1976D2", // Darker Blue
                    "#FFA000", // Darker Amber
                    "#0097A7"  // Darker Cyan
                ]
            }
        ]





    };


    // Extract application trends (ensure it's always an array)
    const applicationTrends = analytics?.applicationTrends || [];

    // Sort data by Year → Month
    const sortedTrends = [...applicationTrends].sort(
        (a, b) => a._id.year - b._id.year || a._id.month - b._id.month
    );

    // Prepare the data for the Line Chart
    const linechartData = {
        labels: sortedTrends.map(item => `${String(item._id.month).padStart(2, "0")}-${item._id.year}`), // Month-Year format (e.g., "02-2025")
        datasets: [
            {
                label: "Applications Over Time",
                data: sortedTrends.map(item => item.count), // Application count
                borderColor: "#36A2EB",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
                tension: 0, // Set tension to 0 for a straight line
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: "#36A2EB",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
            },
        ],
    };

    // Line Chart options
    const linechartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleColor: "#fff",
                bodyColor: "#fff",
                callbacks: {
                    label: (context) => `Applications: ${context.raw}`,
                },
            },
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month-Year",
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                },
                grid: {
                    display: true,
                    color: "#e0e0e0",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Applications Count",
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                },
                min: 0,
                grid: {
                    display: true,
                    color: "#e0e0e0",
                },
            },
        },
    };



    // Extract placement rates data from analytics
    const { placementRates } = analytics;

    if (!placementRates) {
        return <div>No placement rates data available.</div>;
    }
    // Find the number of selected and not selected students
    const selected = placementRates.find(item => item.status === "selected")?.count || 0;
    const notSelected = placementRates.filter(item => item.status !== "selected").reduce((acc, item) => acc + item.count, 0);



    //donut chart
    // Prepare donut chart data
    const donutData = {
        labels: ['Selected', 'Not Selected'],
        datasets: [
            {
                data: [selected, notSelected],
                backgroundColor: ['#1E3A8A', '#F43F5E'], // Dark Blue and Coral Red

                hoverOffset: 4,
            },
        ]



    };
    // Donut chart options (separate options to avoid collision with other charts)
    const donutOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleColor: '#fff',
                bodyColor: '#fff',
            },
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
        },
    };




    const { cgpaDistribution } = analytics;
    const cgpachartData = {
        labels: cgpaDistribution.map(item => `${item._id}-${item._id + 2}`), // Creating CGPA range labels like "0-2", "2-4", etc.
        datasets: [
            {
                label: "Number of Students",
                data: cgpaDistribution.map(item => item.count),
                backgroundColor: "#8E24AA", // New bar color (purple)
                borderColor: "#8E24AA", // Border color matching the bar color
                borderWidth: 1,
            },
        ],
    };


    const cgpachartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw} students`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "CGPA Range",
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Number of Students",
                    font: {
                        size: 16,
                        weight: "bold",
                    },
                },
            },
        },
    };



    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Student Analytics</h2>

            {/* Row 1: Placement Rate Doughnut Chart + Application Status Bar Chart */}
            <div className="flex flex-wrap justify-between mb-8">
                {/* Placement Rate Doughnut Chart */}
                <div className="w-full sm:w-1/2 lg:w-2/3 xl:w-1/2 p-4">
                    <h3 className="text-2xl font-semibold text-center mb-4">Placement Rate</h3>
                    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
                        <Doughnut data={donutData} options={{ maintainAspectRatio: false, responsive: true }} height={300} width={300} />
                    </div>
                </div>

                {/* Application Status Bar Chart */}
                <div className="w-full sm:w-1/2 lg:w-2/3 xl:w-1/2 p-4">
                    <h3 className="text-2xl font-semibold text-center mb-4">Application Status</h3>
                    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
                        <Bar data={applicationStatusData} height={160} width={300} />
                    </div>
                </div>
            </div>

            {/* Row 2: Applications Over Time Line Chart */}
            <div className="flex justify-center mb-8">
                <div className="w-full sm:w-3/4 lg:w-2/3 xl:w-3/4 p-4">
                    <h3 className="text-2xl font-semibold text-center mb-4">Applications Over Time</h3>
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
                        <Line data={linechartData} options={linechartOptions} height={220} width={600} />
                    </div>
                </div>
            </div>

            {/* Row 3: CGPA Distribution Bar Chart + Branch Pie Chart */}
            <div className="flex flex-wrap justify-between mb-8">
                {/* CGPA Distribution Bar Chart */}
                <div className="w-full sm:w-1/2 lg:w-2/3 xl:w-1/2 p-4">
                    <h3 className="text-2xl font-semibold text-center mb-4">CGPA Distribution</h3>
                    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
                        <Bar data={cgpachartData} options={cgpachartOptions} height={160} width={300} />
                    </div>
                </div>

                {/* Branch Pie Chart */}
                <div className="w-full sm:w-1/2 lg:w-2/3 xl:w-1/2 p-4">
                    <h3 className="text-2xl font-semibold text-center mb-4">Students by Branch</h3>
                    <div className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
                        <Pie data={pieChartData} options={{ maintainAspectRatio: false, responsive: true }} height={300} width={300} />
                    </div>
                </div>
            </div>
        </div>
    );

};


export default StudentAnalytics;
