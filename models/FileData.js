const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    fieldname: { type: String, required: true },
    originalname: { type: String, required: true },
    encoding: { type: String, required: true },
    mimetype: { type: String, required: true },
    destination: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true }, // Include the file's URL
});

module.exports = mongoose.model('File', FileSchema);
