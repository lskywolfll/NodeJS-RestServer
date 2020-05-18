const express = require('express');
const { validarExistencia } = require('../Controllers/ControladorUpload');
const path = require('path');
const app = express();
const { verficarTokenImg } = require('../middleware/autenticacion');

app.get('/imagen/:tipo/:img', verficarTokenImg, (req, res) => {
    const { tipo, img } = req.params;

    const noImagePath = path.resolve(__dirname, '../assets/original.jpg');
    const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (validarExistencia(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImagePath);
    }
});

module.exports = app;
