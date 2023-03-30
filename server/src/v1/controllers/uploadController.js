const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.upload = [
    // Use multer middleware to handle file uploads
    upload.single("file"),
    (req, res) => {
        // req.file is the uploaded file
        // You can process the file here and return the URL of the uploaded file
        // For example:
        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    },
];
