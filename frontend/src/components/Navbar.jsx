import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Mobile menu icons
import { FaUserAlt, FaBriefcase,FaClipboardList,FaHome, FaChartLine } from "react-icons/fa"; // New Icons

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Function to check if a link is active
    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Sticky Navbar */}
            <nav className='fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-lg mb-0'>

                <div className='container mx-auto flex justify-between items-center py-4 px-8'>
                    {/* Left: Logo */}
                    <Link to='/' className='text-2xl font-extrabold tracking-wider hover:text-yellow-300 transition-colors'>
                        SCET T&P Portal
                    </Link>

                    {/* Center: Main Nav Links */}
                    <ul className='hidden md:flex space-x-8 text-lg font-semibold'>
                        <li>
                            <Link to='/' className={`transition-all duration-300 ${isActive("/") ? "text-yellow-300" : "hover:text-yellow-400"}`}>
                            <FaHome size={20} className="inline mr-2" />
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to='/jobs' className={`transition-all duration-300 ${isActive("/jobs") ? "text-yellow-300" : "hover:text-yellow-400"}`}>
                                <FaBriefcase size={20} className="inline mr-2" />
                                Jobs
                            </Link>
                        </li>
                        {user?.role === "admin" ? (
                            <li>
                                <Link to='/dashboard' className={`transition-all duration-300 ${isActive("/dashboard") ? "text-yellow-300" : "hover:text-yellow-400"}`}>
                                    <FaChartLine size={20} className="inline mr-2" />
                                    Dashboard
                                </Link>
                            </li>
                        ) : user?.role === "student" ? (
                            <li>
                                <Link
                                    to='/applications'
                                    className={`transition-all duration-300 ${isActive("/applications") ? "text-yellow-300" : "hover:text-yellow-400"}`}
                                >
                                    <FaClipboardList size={20} className="inline mr-2" />
                                    My Applications
                                </Link>
                            </li>
                        ) : null}

                        {user?.role === "student" ? (
                            <li>
                                <Link to='/student-analytics' className={`transition-all duration-300 ${isActive("/student-analytics") ? "text-yellow-300" : "hover:text-yellow-400"}`}>
                                    <FaChartLine size={20} className="inline mr-2" />
                                    Analytics
                                </Link>
                            </li>
                        ): 
                        <li>
                                <Link to='/admin-analytics' className={`transition-all duration-300 ${isActive("/student-analytics") ? "text-yellow-300" : "hover:text-yellow-400"}`}>
                                    <FaChartLine size={20} className="inline mr-2" />
                                    Analytics
                                </Link>
                            </li>}
                    </ul>

                    {/* Right: Profile/Auth Links */}
                    <div className='hidden md:flex space-x-5 items-center'>
                        {user ? (
                            <>
                                <Link to='/profile' className={`transition-all duration-300 ${isActive("/profile") ? "text-yellow-300" : "hover:text-yellow-400"}`}>
                                    <FaUserAlt size={20} className="inline mr-2" />
                                    Profile
                                </Link>
                                <button onClick={handleLogout} className='bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition-colors'>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to='/register' className={`transition-all duration-300 ${isActive("/register") ? "text-yellow-300" : "hover:text-yellow-400"}`}>
                                    Register
                                </Link>
                                <Link to='/login' className='bg-yellow-500 px-4 py-2 rounded-lg text-white hover:bg-yellow-600 transition-colors'>
                                    Login
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className='md:hidden text-2xl' onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className='md:hidden bg-gray-800 text-center py-6 space-y-6'>
                        <Link
                            to='/'
                            className={`block ${isActive("/") ? "text-yellow-300" : "hover:text-yellow-400"}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to='/jobs'
                            className={`block ${isActive("/jobs") ? "text-yellow-300" : "hover:text-yellow-400"}`}
                            onClick={() => setMenuOpen(false)}
                        >
                            Jobs
                        </Link>
                        {user?.role === "admin" ? (
                            <Link
                                to='/dashboard'
                                className={`block ${isActive("/dashboard") ? "text-yellow-300" : "hover:text-yellow-400"}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        ) : user?.role === "student" ? (
                            <Link
                                to='/applications'
                                className={`block ${isActive("/applications") ? "text-yellow-300" : "hover:text-yellow-400"}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                My Applications
                            </Link>
                        ) : null}
                        {user ? (
                            <>
                                <Link
                                    to='/profile'
                                    className={`block ${isActive("/profile") ? "text-yellow-300" : "hover:text-yellow-400"}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className='block w-full text-red-400 hover:text-red-500'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to='/register'
                                    className={`block ${isActive("/register") ? "text-yellow-300" : "hover:text-yellow-400"}`}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Register
                                </Link>
                                <Link to='/login' className='block bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600' onClick={() => setMenuOpen(false)}>
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Push down content to prevent overlap */}
            {/* <div className='h-16 md:h-20'></div> */}
        </>
    );
};

export default Navbar;
