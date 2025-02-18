import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate, useParams,useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const branchOptions = [
  { value: "ALL", label: "ALL" },
  { value: "Computer", label: "Computer" },
  { value: "IT", label: "IT" },
  { value: "Mechanical", label: "Mechanical" },
  { value: "Electrical", label: "Electrical" },
  { value: "Civil", label: "Civil" },
  { value: "Chemical", label: "Chemical" },
  { value: "Electronics", label: "Electronics" },
  { value: "Biomedical", label: "Biomedical" },
  { value: "Automobile", label: "Automobile" },
];

const predefinedRequirements = [
  { value: "Strong Communication Skills", label: "Strong Communication Skills" },
  { value: "Problem-Solving", label: "Problem-Solving" },
  { value: "Data Structures & Algorithms", label: "Data Structures & Algorithms" },
  { value: "Web Development", label: "Web Development" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Database Management", label: "Database Management" },
  { value: "Cloud Computing", label: "Cloud Computing" },
  { value: "Networking", label: "Networking" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Team Collaboration", label: "Team Collaboration" },
  { value: "Leadership Skills", label: "Leadership Skills" },
];

const JobPostingForm = ({ onSubmit }) => {
  const { jobId } = useParams(); // To get the job ID for editing
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    branch: [{ value: "ALL", label: "ALL" }],
    criteria: { cgpa: "", backlogs: 0 },
    requirements: [],
    salary: "",
    deadline: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const formatJobData = (job) => ({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      description: job.description || "",
      branch: job.branch?.map((b) => 
        typeof b === "string" ? { value: b, label: b } : b
      ) || [{ value: "ALL", label: "ALL" }],
      criteria: job.criteria || { cgpa: "", backlogs: 0 },
      requirements: job.requirements?.map((r) => 
        typeof r === "string" ? { value: r, label: r } : r
      ) || [],
      salary: job.salary || "",
      deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : "",
    });
  
    if (location.state?.job) {
      setFormData(formatJobData(location.state.job));
    } else if (jobId) {
      axios
        .get(`${BASE_URL}/jobs/${jobId}`)
        .then((response) => setFormData(formatJobData(response.data)))
        .catch((error) => console.error("Error fetching job:", error));
    }
  }, [jobId, location.state]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate CGPA
    if (formData.criteria.cgpa < 0 || formData.criteria.cgpa > 10) {
      alert("CGPA must be between 0 and 10.");
      return;
    }

    // Validate Salary (Must be positive)
    if (formData.salary <= 0) {
      alert("Salary must be a positive number.");
      return;
    }

    try {
      if (jobId) {
        // If jobId exists, update the job
        const response = await axios.put(`${BASE_URL}/jobs/${jobId}`, formData);
        alert("Job Updated Successfully!");
        navigate(`/jobs/${jobId}`); // Redirect to the job detail page after update
      } else {
        // If no jobId, create a new job
        const response = await axios.post(`${BASE_URL}/jobs/post`, formData);
        alert("Job Posted Successfully!");
        navigate("/jobs"); // Redirect to the job listings after posting
      }
    } catch (error) {
      console.error("Error posting/updating job:", error);
      alert("Failed to post/update job.");
    }
  };

  const handleChange = (selected, action) => {
    setFormData({ ...formData, [action.name]: selected });
  };

  const handleCgpaChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0 && value <= 10) {
      setFormData({ ...formData, criteria: { ...formData.criteria, cgpa: value } });
    }
  };

  const handleSalaryChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0) {
      setFormData({ ...formData, salary: value });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{jobId ? "Edit Job" : "Post a Job"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Job Title"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="Company Name"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Location"
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Job Description"
          className="w-full border p-2 rounded"
        />

        {/* Branch Selection (Multi-Select) */}
        <label className="block">Branch</label>
        <Select
          name="branch"
          options={branchOptions}
          value={formData.branch}
          onChange={handleChange}
          isMulti
          className="w-full border p-2 rounded"
        />

        <label className="block">CGPA Criteria (0 - 10)</label>
        <input
          type="number"
          name="cgpa"
          value={formData.criteria.cgpa}
          onChange={handleCgpaChange}
          step="0.1"
          min="0"
          max="10"
          className="w-full border p-2 rounded"
        />

        <label className="block">Max Backlogs Allowed</label>
        <input
          type="number"
          name="backlogs"
          value={formData.criteria.backlogs}
          onChange={(e) => setFormData({ ...formData, criteria: { ...formData.criteria, backlogs: e.target.value } })}
          min="0"
          className="w-full border p-2 rounded"
        />

        {/* Multi-Select + Custom Requirements */}
        <label className="block">Select Requirements (or Add Custom)</label>
        <CreatableSelect
          name="requirements"
          options={predefinedRequirements}
          value={formData.requirements}
          onChange={handleChange}
          isMulti
          className="w-full border p-2 rounded"
        />

        <label className="block">Salary (in LPA)</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleSalaryChange}
          step="0.1"
          min="0"
          className="w-full border p-2 rounded"
        />

        <label className="block">Application Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          {jobId ? "Update Job" : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default JobPostingForm;
