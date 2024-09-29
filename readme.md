To create a project that allows users to upload profile pictures using Node.js and Express API, you can follow these steps. The project will handle image uploads using the multer middleware, which simplifies file handling in Node.js.

## Steps:
- Set up a new Node.js project
- Install necessary dependencies
- Create a file upload route
- Handle file uploads using multer and add form fields (`firstName` and `lastName`)
- Serve static files (images) OR Return the form fields along with the file path in the response.
- Run the server and test the upload
### 1. Initialize a Node.js project
```
mkdir fileupload_express_multer_example
cd fileupload_express_multer_example
npm init -y
```
### 2. Install dependencies
```
npm install express multer
```
### 3. Create the server (index.js)
```
const express = require('express');
const multer = require('multer');
const path = require('path');

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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```
### 4. Directory Structure
Make sure to create an uploads/ directory where the files will be stored:
```
mkdir uploads
```
### 5. Test the API
You can test the API using tools like Postman or cURL.

In Postman:

- Select the POST method.
- Enter http://localhost:5000/upload as the URL.
- In the "Body" tab, select form-data.
- Add a key firstName and enter a value (e.g., John).
- Add a key lastName and enter a value (e.g., Doe).
- Add a key profilePicture and select a file from your computer.
When the upload is successful, the API will return a JSON response containing the path to the uploaded file.
### 6. Serving the uploaded images
You can access the uploaded images through the /uploads route. For example, if your image is named `profilePicture-1727645827651.jpg`, you can access it via:

```
http://localhost:5000/uploads/profilePicture-1727645827651.png
```
### 7. Sample API Response
After a successful upload, you will get a JSON response with the following structure:
```
{
    "message": "File uploaded successfully!",
    "firstName": "Pritesh",
    "lastName": "Patel",
    "file": "uploads/profilePicture-1727645827651.png"
}
```
This way, the API now accepts firstName, lastName, and profilePicture in the same request, storing the image and returning all data in the response.

## References
- https://github.com/expressjs/multer
- https://blog.logrocket.com/multer-nodejs-express-upload-file/
