const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files directly from the root directory
app.use(express.static(path.join(__dirname)));

// Serve images from 'images1' directory
app.use('/images1', express.static(path.join(__dirname, 'images1')));

// Serve index.html from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to get images list
app.get('/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'images1');
    fs.readdir(directoryPath, function(err, files) {
        if (err) {
            return res.status(500).send({
                message: "Unable to scan images directory",
                error: err
            });
        }
        const images = files.filter(file => file.endsWith('.jpg'));
        res.send(images);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
