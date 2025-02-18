import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes", // Cloudinary folder name
    format: async (req, file) => "pdf", // Ensuring only PDFs
    public_id: (req, file) => file.originalname.split(".")[0], // Use original name without extension
  },
});

const upload = multer({ storage });

export { upload, cloudinary };
