To modify the code for single file upload using Multer, you can make a few simple adjustments. Instead of using `upload.array()`, we'll use `upload.single()` to handle the upload of just one file.

### Updated Code for Single File Upload:

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

// Set up the Express app
const app = express();

// Middleware to parse JSON in the request body
app.use(express.json());

// Configure Multer to specify where and how to store the uploaded file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder to store files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Customize file name
    }
});

// Set up Multer for single file upload
const upload = multer({ storage: storage });

// Route to handle POST request with product info and a single file upload
app.post('/upload', upload.single('file'), (req, res) => {
    try {
        // Access product information from the request body
        const { productName, productDescription, price } = req.body;

        // Access file from the request
        const file = req.file;

        // Check if a file exists
        if (!file) {
            return res.status(400).send({ message: 'No file uploaded!' });
        }

        // Process the product information and file (e.g., save to database)
        console.log('Product Name:', productName);
        console.log('Product Description:', productDescription);
        console.log('Price:', price);
        console.log('Uploaded File:', file);

        // Respond to the client
        res.status(200).send({
            message: 'File uploaded successfully!',
            productInfo: { productName, productDescription, price },
            uploadedFile: file
        });
    } catch (err) {
        res.status(500).send({ message: 'Error uploading file', error: err });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
```

### Key Changes:

1. **Multer Configuration for Single File:**
   - Replaced `upload.array('files', 5)` with `upload.single('file')`, which handles a single file upload.

2. **Accessing Single File:**
   - `req.file` contains the uploaded file (since it's a single file upload), instead of `req.files` for multiple files.

3. **Testing with Postman:**
   - Use **form-data** in the body.
   - Include keys for `productName`, `productDescription`, and `price` as text fields.
   - Add a **single file** using the key `file` (the name specified in `upload.single('file')`).

### Example Postman Request:
```bash
POST http://localhost:3000/upload

Form Data:
    - productName: "Product A"
    - productDescription: "Description of Product A"
    - price: 100
    - file: (Select a single file to upload)
```

### Output:
The response will contain the product information and details of the uploaded file.

Let me know if you need any further modifications or clarifications!