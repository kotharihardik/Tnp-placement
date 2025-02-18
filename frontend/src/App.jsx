import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import JobDetails from "./pages/JobDetails";
import StudentAnalytics from "./pages/StudentAnalytics";
import JobPostingForm from "./pages/Jobposting";
import AdminAnalytics from "./pages/AdminAnalytics";

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/jobs' element={<Jobs />} />
                <Route path='/applications' element={<Applications />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/jobs/:id' element={<JobDetails />} />
                <Route path="/student-analytics" element={<StudentAnalytics />} />
                <Route path="/admin-analytics" element={<AdminAnalytics />} />
                <Route path="/posting/:jobId?" element={<JobPostingForm/>}/>
            </Routes>
        </>
    );
}
