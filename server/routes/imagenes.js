const express = require('express');
// const fs = require('fs');
const path = require('path');
const app = express();

app.get('/imagen/:tipo/:img', (req, res) => {
    const { tipo, img } = req.params;

    const pathImg = `./uploads/${tipo}/${img}`;
    const noImagePath = path.resolve(__dirname, '../assets/original.jpg');

    res.sendFile(noImagePath);
});

module.exports = app;
