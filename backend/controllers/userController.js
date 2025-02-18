import User from "../models/User.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { name, email, enrollmentNo, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ enrollmentNo });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in User collection
        const user = new User({ name, email, enrollmentNo, password: hashedPassword, role });
        await user.save();

        // If role is "student", create entry in Student collection
        if (role === "student") {
            const student = new Student({
                name,
                email,
                enrollmentNo,
                gender: "",
                graduationYear: null,
                branch: "",
                dob: null,
                phone: null,
                cgpa: null,
                backlogHistory: null,
                liveBacklog: null,
                resumeLink: "",
                linkedinLink: "",
            });
            await student.save();
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error); // Log error in backend
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { enrollmentNo, password } = req.body;
    const user = await User.findOne({ enrollmentNo });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role });
};
