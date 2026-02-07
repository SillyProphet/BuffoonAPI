const multer = require("multer"); // Dependency for handling images.

// Configuration for storing images.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Path for image uploads (Make sure folder exists!).
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // How image names are formatted.
  },
});
const upload = multer({ storage: storage });

// Allows for use in "index.js".
module.exports = upload;