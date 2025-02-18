import express from "express";
import { getStudentAnalytics } from "../controllers/studentAnalyticsController.js";
import { getAdminAnalytics } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

// 📊 Student Analytics Route
router.get("/student/:enrollmentNo", getStudentAnalytics);

// 📊 Admin Analytics Route (Future Use)
router.get("/admin", getAdminAnalytics);

export default router;
