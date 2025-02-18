import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Ensure AuthContext provides user details

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const { user } = useAuth(); // Assuming user object contains role and enrollmentNo
  const [student, setStudent] = useState({
    resumeLink: null, // for storing the file
  });
  const [isEditing, setIsEditing] = useState(false); // state for enabling/disabling fields
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user?.enrollmentNo || user?.role === "admin") return; // Skip fetching if admin

    const fetchStudent = async () => {
      try {
        const apiUrl = `${BASE_URL}/student/${user?.enrollmentNo}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch student data (Status: ${response.status})`);
        }
        const data = await response.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student data:", error.message);
      }
    };

    fetchStudent();
  }, [user?.enrollmentNo, user?.role]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleValidation = () => {
    const validationErrors = {};
    if (student.cgpa < 0 || student.cgpa > 10) {
      validationErrors.cgpa = "CGPA must be between 0 and 10.";
    }
    if (!student.gender) {
      validationErrors.gender = "Please select gender.";
    }
    if (!student.branch) {
      validationErrors.branch = "Please select your branch.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!handleValidation()) return;
  
    const formData = new FormData();
  
    // Loop through the student object and append each field to FormData
    for (const key in student) {
      if (student.hasOwnProperty(key) && key !== 'graduationYear' && key !== 'liveBacklog') {
        // Only append fields that are valid and not empty
        if (student[key] !== null && student[key] !== '') {
          console.log(`Appending: ${key} = ${student[key]}`);
          formData.append(key, student[key]);
        }
      }
    }
  
    // Check if file is selected, then append
    if (file) {
      console.log("Appending resume file:", file);
      formData.append("resumeLink", file);
    }
  
    // Log FormData contents before sending to the backend
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }
  console.log(Array.from(formData));
    try {
      const response = await fetch(`${BASE_URL}/student/${user.enrollmentNo}`, {
        method: "PUT",
        body: formData, // Send the form data with the file
      });
  
      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false); // Switch to view mode after update
      } else {
        alert("Error updating profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
  

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // Store the selected file
  };

  if (user?.role === "admin") {
    return (
      <div className="max-w-lg mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="text-xl font-semibold">Enrollment Number: {user.enrollmentNo}</p>
        <p className="text-blue-600 text-lg">You are an admin</p>
      </div>
    );
  }

  if (!student) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="space-y-4">
        <form encType="multipart/form-data">
          {/* Read-only Fields */}
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={student.name || ""}
              disabled
              className="w-full p-2 border rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={student.email || ""}
              disabled
              className="w-full p-2 border rounded bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Enrollment No</label>
            <input
              type="text"
              name="enrollmentNo"
              value={student.enrollmentNo || ""}
              disabled
              className="w-full p-2 border rounded bg-gray-200"
            />
          </div>

          {/* Editable Fields */}
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <div className="flex space-x-4 gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={student.gender === "Male"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Male
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={student.gender === "Female"}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                Female
              </label>
            </div>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Branch</label>
            <select
              name="branch"
              value={student.branch || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="">Select Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electronics">Electronics</option>
            </select>
            {errors.branch && <p className="text-red-500 text-sm">{errors.branch}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">CGPA</label>
            <input
              type="number"
              name="cgpa"
              value={student.cgpa || ""}
              onChange={handleChange}
              disabled={!isEditing}
              min="0"
              max="10"
              step="0.01"
              className={`w-full p-2 border rounded ${isEditing ? "bg-white" : "bg-gray-200"}`}
            />
            {errors.cgpa && <p className="text-red-500 text-sm">{errors.cgpa}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={student.dob || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${isEditing ? "bg-white" : "bg-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={student.phone || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${isEditing ? "bg-white" : "bg-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Backlog History</label>
            <input
              type="text"
              name="backlogHistory"
              value={student.backlogHistory || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${isEditing ? "bg-white" : "bg-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Resume</label>
            <input
              type="file"
              name="resumeLink"
              onChange={handleFileChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${isEditing ? "bg-white" : "bg-gray-200"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">LinkedIn Link</label>
            <input
              type="url"
              name="linkedinLink"
              value={student.linkedinLink || ""}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${isEditing ? "bg-white" : "bg-gray-200"}`}
            />
          </div>

          {/* Edit / Update Button */}
          <button
            type="button"
            onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            {isEditing ? "Update" : "Edit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
