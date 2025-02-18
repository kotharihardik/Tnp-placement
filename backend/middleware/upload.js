import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the path to the uploads folder at the root level (outside 'middleware')
const uploadDir = path.join(__dirname, '../uploads');  // Adjust path accordingly

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // Save the file in the correct 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Use current timestamp for unique filename
  },
});

const upload = multer({ storage });

export default upload;
