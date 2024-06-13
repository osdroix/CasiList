const express = require('express');
const multer = require('multer');
const router = express.Router();
const { listCollections, createCollection, uploadFile, getFilesFromCollection, downloadFile, deleteFile, deleteCollection, renameCollection  } = require('../controllers/customerController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para renderizar la página principal con las colecciones disponibles
router.get('/', listCollections);

// Ruta para crear una nueva colección
router.post('/create-collection', createCollection);

// Ruta para subir archivos a una colección específica
router.post('/upload', upload.single('file'), uploadFile);

// Ruta para ver los archivos de una colección específica
router.get('/files', getFilesFromCollection);
router.get('/download', downloadFile);
router.post('/delete', deleteFile);
router.post('/delete-collection', deleteCollection);
router.post('/rename-collection', renameCollection);

module.exports = router;
