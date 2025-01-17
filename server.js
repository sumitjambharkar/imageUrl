const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const File = require('./models/FileData');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT


mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Upload Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Construct the URL for the uploaded file
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Save file details to the database
        const fileData = new File({
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            destination: req.file.destination,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            url: fileUrl, // Save the generated URL
        });

        await fileData.save();
        res.status(200).send({ message: 'File uploaded successfully!', data: fileData });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error uploading file' });
    }
});

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
