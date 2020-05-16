const express = require('express');
// middleware automatico para poder subir archivos
const fileUpload = require('express-fileupload');
const app = express();
// const { verficarToken } = require('../middleware/autenticacion');

const extensionesValidas = ['jpg', 'png', 'pdf', 'jpeg'];
// opciones por defecto y habilitacion de creacion de arcihvos
// Lo convierte todos los archivos qe se suban a req.files (LLegaran siempre a esa propiedad)
app.use(fileUpload({ useTempFiles: true }));

app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo!',
            },
        });
    }

    if (req.files.archivos.length > 1) {
        // Itero multiples archivos
        req.files.archivos.forEach((archivo) => {
            let extension = archivo.mimetype.split('/')[1];

            if (extensionesValidas.indexOf(extension) < 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Las extensiones permitidas son: ' + extensionesValidas.join(','),
                    },
                });
            }

            archivo.mv(`uploads/${archivo.name}`, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }
            });
        });

        return res.status(200).json({
            ok: true,
            message: 'Se ha subido correctamente',
            archivos: req.files.archivos,
        });
    } else {
        let archivoEjemplo = req.files.archivos;

        let extension = archivoEjemplo.mimetype.split('/')[1];

        if (extensionesValidas.indexOf(extension) < 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son: ' + extensionesValidas.join(','),
                },
            });
        } else {
            archivoEjemplo.mv(`uploads/${archivoEjemplo.name}`, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }

                return res.status(200).json({
                    ok: true,
                    message: 'Se ha subido correctamente',
                    detalles: {
                        name: archivoEjemplo.name,
                        extension: archivoEjemplo.mimetype,
                    },
                });
            });
        }
    }
});

module.exports = app;
