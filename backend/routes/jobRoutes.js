import express from "express";
import { createJob, getJobs, getJobById, deleteJob ,updateJob} from "../controllers/jobController.js";

const router = express.Router();

router.post("/post", createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.delete("/:id", deleteJob);
router.put("/:id", updateJob);

export default router;
