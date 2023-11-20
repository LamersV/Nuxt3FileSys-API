const express = require('express');
const fileUpload = require('express-fileupload');

const cors = require('cors');
const { getAllFilesAndDirectories, moveFile, copyFile, deleteFile, renameFile, createDirectory, getFile, uploadFiles } = require('./fileSys');
const { filesPayloadExists } = require('./fileMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/file-system', async (req, res) => {
    try {
        const files = getAllFilesAndDirectories(req.body.path);
        res.json({ success: true, files });
    }   
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
})

app.post('/file-system/folder', (req, res) => {
    try {
        createDirectory(req.body.parentDir, req.body.name);
        res.json({ success: true });
    }
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/file-system/file', fileUpload({ createParentPath: true }), filesPayloadExists, (req, res) => {
    try {
        uploadFiles(req.files, req.body.destinationDir);
        res.json({ success: true });
    }
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/file-system/open', (req, res) => {
    try {
        const file = getFile(req.body.path);
        res.json({ success: true, file });
    }
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/file-system/move', (req, res) => {
    try {
        throw new Error('Not implemented');
        moveFile(req.body.item, req.body.destinationDir);
        res.json({ success: true });
    }   
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
})

app.put('/file-system/copy', (req, res) => {
    try {
        copyFile(req.body.item, req.body.destinationDir);
        res.json({ success: true });
    }   
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/file-system/rename', (req, res) => {
    try {
        renameFile(req.body.item, req.body.newName);
        res.json({ success: true });
    }   
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/file-system', (req, res) => {
    try {
        deleteFile(req.body.item);
        res.json({ success: true });
    }
    catch (error) {
        
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(4000, () => {
    console.log('Example app listening on port 4000!');
});
