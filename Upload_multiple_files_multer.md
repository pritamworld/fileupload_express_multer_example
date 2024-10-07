To upload multiple files along with product information in the request body using Node.js, Express, and Multer, follow these steps:

### Step 1: Install Required Packages
You need `express`, `multer`, and other basic packages:

```bash
npm install express multer
```

### Step 2: Setup Multer for File Uploads
Multer is used as middleware to handle file uploads. We'll configure it to handle multiple files.

### Step 3: Express Code to Handle File Uploads and Product Info

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

// Set up the Express app
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

// Configure Multer to specify where and how to store the uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder to store files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Customize file name
    }
});

// Set up Multer for multiple file uploads
const upload = multer({ storage: storage });

// Route to handle POST request with product info and file uploads
app.post('/upload', upload.array('files', 5), (req, res) => {
    try {
        // Access product information from the request body
        const { productName, productDescription, price } = req.body;

        // Access files from the request
        const files = req.files;

        // Check if files exist
        if (!files || files.length === 0) {
            return res.status(400).send({ message: 'No files uploaded!' });
        }

        // Process the product information and files (e.g., save to database)
        console.log('Product Name:', productName);
        console.log('Product Description:', productDescription);
        console.log('Price:', price);
        console.log('Uploaded Files:', files);

        // Respond to the client
        res.status(200).send({
            message: 'Files uploaded successfully!',
            productInfo: { productName, productDescription, price },
            uploadedFiles: files
        });
    } catch (err) {
        res.status(500).send({ message: 'Error uploading files', error: err });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
```

### Explanation:
1. **Multer Setup**: 
   - `multer.diskStorage()` is used to specify the storage location and file naming convention.
   - Files will be stored in the `uploads/` directory (you should create this directory).

2. **Handling the POST Request**:
   - The `upload.array('files', 5)` middleware allows uploading up to 5 files with the form field name `files`.
   - `req.files` contains the uploaded files, and `req.body` contains the product information.

3. **Product Information**:
   - This example assumes that the product information (e.g., `productName`, `productDescription`, `price`) is sent in the request body as JSON or form data.

### Step 4: Test with Postman
1. Set the request method to **POST**.
2. URL: `http://localhost:3000/upload`
3. In the **Body** tab:
   - Select **form-data**.
   - Add keys for `productName`, `productDescription`, and `price` as text.
   - Add multiple files using the key `files` and choose files from your system.

### Output:
If successful, you will receive a JSON response with the product information and details of the uploaded files.

### Example Postman Request:
```bash
POST http://localhost:3000/upload

Form Data:
    - productName: "Product A"
    - productDescription: "Description of Product A"
    - price: 100
    - files: (Select multiple files to upload)
```

Let me know if you need further adjustments or details!