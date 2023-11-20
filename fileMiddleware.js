const path = require('path');

const filesPayloadExists = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ success: false, error: 'No files were uploaded.' });
    next();
};

const MaxMB = 40;
const fileSizeLimit = MaxMB * 1024 * 1024; //42000000;

const fileSizeLimiter = (req, res, next) => {
    const files = req.files;

    const filesOverLimit = Object.keys(files).filter(file => files[file].size > fileSizeLimit);
    if (filesOverLimit.length > 0) return res.status(400).json({ success: false, error: 'File size limit exceeded.' });

    next();
}

const defaultAllowedExt = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', '7z', 'mp3', 'mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm', 'ogg', 'wav'];
const fileExtLimiter = (allowedExtArray = defaultAllowedExt) => {
    return (req, res, next) => {
        const files = req.files;

        const filesNotAllowed = Object.keys(files).filter(file => !allowedExtArray.includes(path.extname(files[file].name)));
        if (filesNotAllowed.length > 0) return res.status(400).json({ success: false, error: 'File extension not allowed.' });

        next();
    }

}

module.exports = { filesPayloadExists, fileSizeLimiter, fileExtLimiter };