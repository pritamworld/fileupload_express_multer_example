const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { basename, extname } = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Memory storage so it also works on Vercel (no disk writes)
const cloudinaryUpload = multer({ storage: multer.memoryStorage() });

async function uploadToCloudinary(buffer, filename, options = {}) {
  console.log('Uploading to Cloudinary:', { filename, ...options });
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('buffer must be a Buffer');
  }
  if (!filename || typeof filename !== 'string') {
    throw new TypeError('filename must be a non-empty string');
  }

  const nameOnly = basename(filename, extname(filename));

  console.log('Derived public_id:', nameOnly);

  const {
    folder = 'comp3123/users',
    public_id = nameOnly,
    resource_type = 'auto', // handles images, video, pdf, etc.
    overwrite = true,
    ...rest
  } = options;

  console.log('Cloudinary upload options:', { folder, public_id, resource_type, overwrite, ...rest });

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, public_id, resource_type, overwrite, ...rest },
      (err, result) => { 
        if(err) {
          console.log('Cloudinary Upload Error:', err);
          reject(err)
        } else {
          console.log('Cloudinary Upload Result:', result);
          resolve(result)
        }
      }).end(buffer);
  });
}

module.exports = { cloudinaryUpload, uploadToCloudinary };
