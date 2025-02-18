import express from "express";
import { getSelectedApplicants , getStudentByEnrollmentNo, getStudents, updateStudent, getStudentsByBranch } from "../controllers/studentController.js";
import upload from "../middleware/upload.js";
const router = express.Router();


router.get("/", getStudents)
router.get("/selected",getSelectedApplicants )
router.put('/:enrollmentNo', upload.single('resumeLink'), updateStudent); 
router.get("/:enrollmentNo", getStudentByEnrollmentNo); // Get student by enrollment no.
router.get("/branchcount", getStudentsByBranch);



export default router;
