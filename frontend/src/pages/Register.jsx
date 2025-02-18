import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        enrollmentNo: "",
        password: "",
        role: "student",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        try {
            const response = await fetch(`${BASE_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Unknown error");

            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message);
            console.error("Frontend Error:", err); // Log error in browser console
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <form onSubmit={handleRegister} className='p-6 bg-white shadow-md rounded-md'>
                <h2 className='text-2xl font-bold mb-4'>Register</h2>
                {error && <p className='text-red-500'>{error}</p>}
                {success && <p className='text-green-500'>Registration successful! Redirecting...</p>}
                <input
                    type='text'
                    name='name'
                    placeholder='Full Name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full p-2 border rounded mb-2'
                />
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full p-2 border rounded mb-2'
                />
                <input
                    type='text'
                    name='enrollmentNo'
                    placeholder='Enrollment No'
                    value={formData.enrollmentNo}
                    onChange={handleChange}
                    required
                    className='w-full p-2 border rounded mb-2'
                />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='w-full p-2 border rounded mb-2'
                />


                <select name='role' value={formData.role} onChange={handleChange} className='w-full p-2 border rounded mb-2'>
                    <option value='student'>Student</option>
                    <option value='admin'>Admin</option>
                </select>


                <button type='submit' className='w-full bg-green-500 text-white p-2 rounded'>
                    Register
                </button>
                <p className='mt-3'>
                    Already have an account?{" "}
                    <a href='/login' className='text-blue-500'>
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Register;
