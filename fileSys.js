const fs = require('fs');
const mime = require('mime');

const getAllFilesAndDirectories = (path) => {
    const defaultPath = './files';
    // console.log(`PATH: ${defaultPath}/${path}`);

    const directory = [];
    const files = fs.readdirSync(`${defaultPath}/${path}`);

    if (!files) return directory;

    for (let f of files) {
        const stats = fs.lstatSync(`${defaultPath}/${path}/${f}`);
        const isDirectory = stats.isDirectory();
        
        if (isDirectory) {
            directory.push({
                name: f,
                isDirectory: true,
                dateModified: stats.mtime,
                url: fs.realpathSync(`${defaultPath}/${path}/${f}`),
                items: getAllFilesAndDirectories(`${path}/${f}`)
            });
        } else {
            directory.push({
                name: f,
                isDirectory: false,
                dateModified: stats.mtime,
                extension: getFileExtension(f),
                path: fs.realpathSync(`${defaultPath}/${path}/${f}`),
                mime: mime.getType(`${defaultPath}/${path}/${f}`),
                size: stats.size,
            });
        }        
    }

    return directory;
}

const getFile = (path) => {
    const stats = fs.lstatSync(path);
    const buffer = fs.readFileSync(path);

    return {
        name: path.split('\\').pop(),
        dateModified: stats.mtime,
        extension: getFileExtension(path),
        path: path,
        mime: mime.getType(path),
        buffer: buffer,
        size: stats.size
    }
}

const moveFile = (item, destinationDir) => {
    const defaultPath = './files';
    const oldPath = `${defaultPath}/${item.path}`;
    const newPath = `${defaultPath}/${destinationDir.path}/${item.name}`;

    if (fs.existsSync(newPath)) throw new Error('Arquivo já existe');

    fs.renameSync(oldPath, newPath);
}

const copyFile = (item, destinationDir) => {
    const defaultPath = './files';
    const oldPath = `${defaultPath}/${item.path}`;
    const newPath = `${defaultPath}/${destinationDir.path}/${item.name}`;

    if (fs.existsSync(newPath)) throw new Error('Arquivo já existe');

    if (item.isDirectory) throw new Error('Não é possível copiar diretórios');

    fs.copyFileSync(oldPath, newPath);
}

const deleteFile = (item) => {
    const defaultPath = './files';
    const oldPath = `${defaultPath}/${item.path}`;

    if (!fs.existsSync(oldPath)) throw new Error('Arquivo não existe');

    if (item.isDirectory) {
        if (fs.readdirSync(oldPath).length > 0) throw new Error('Diretório não está vazio');
        fs.rmdirSync(oldPath);
    }
    else fs.unlinkSync(oldPath);
}

const renameFile = (item, newName) => {
    const defaultPath = './files';
    const oldPath = `${defaultPath}/${item.path}`;
    const newPath = `${defaultPath}/${item.parentPath}/${newName}`;

    if (fs.existsSync(newPath)) throw new Error('Arquivo já existe');

    if (item.isDirectory) throw new Error('Renomear diretórios não é permitido');

    fs.renameSync(oldPath, newPath);
}

const createDirectory = (parentDir, name) => {
    const defaultPath = './files';
    const oldPath = `${defaultPath}/${parentDir.path}`;
    const newPath = `${defaultPath}/${parentDir.path}/${name}`;

    if (fs.existsSync(newPath)) throw new Error('Arquivo já existe');

    fs.mkdirSync(newPath);
}

const uploadFiles = (files, destinationDir) => {
    const destination = JSON.parse(destinationDir);
    const defaultPath = './files';

    const tempFiles = Object.values(files);

    for (let file of tempFiles) {
        const filePath = `${defaultPath}/${destination.path}/${file.name}`;
        console.log(filePath);
        fs.writeFileSync(filePath, file.data);
    }
}

//* UTILS

const getFileExtension = (filename) => {
    return filename.split('.').pop();
}

module.exports = { getAllFilesAndDirectories, moveFile, copyFile, deleteFile, renameFile, createDirectory, getFile, uploadFiles };