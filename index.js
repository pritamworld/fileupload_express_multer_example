const express = require('express');
const multer = require('multer');
const path = require('path');
const errorHandler = require('./errorMiddleware');
const dotenv = require('dotenv');

//Set up environment variables configuration
var nodeEnvironment = process.env.NODE_ENV || "development";
dotenv.config({ path: `./${nodeEnvironment}.env` });

// Initialize the app
const app = express();

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Set file size limit to 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('profilePicture');

// Check file type (only allow images)
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Middleware to parse incoming form data (text fields)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static folder
app.use('/uploads', express.static('uploads'));

// Upload route with form data
app.post('/upload', (req, res) => {
  // Handle the file upload first
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      // Extract form fields (firstName and lastName)
      const { firstName, lastName } = req.body;

      // Check if the file was uploaded
      if (!req.file) {
        return res.status(400).send('Error: No file selected!');
      } else if (!firstName || !lastName) {
        return res.status(400).send('Error: Missing firstName or lastName');
      } else {
        // Successfully uploaded
        res.json({
          message: 'File uploaded successfully!',
          firstName: firstName,
          lastName: lastName,
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

// Error handler middleware
// Example route handler
app.get('/example', (req, res, next) => {
  try {
    // Some code that might throw an error
    throw new Error('Example error');
  } catch (error) {
    // Pass the error to Express error handler middleware
    next(error);
  }
});

// Register the error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
