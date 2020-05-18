const express = require('express');
// middleware automatico para poder subir archivos
const fileUpload = require('express-fileupload');
const app = express();
// const { verficarToken } = require('../middleware/autenticacion');
const { imagenProducto, imagenUsuario } = require('../Controllers/ControladorUpload');
const extensionesValidas = ['jpg', 'png', 'pdf', 'jpeg'];
const tiposValidos = ['productos', 'usuarios'];
// opciones por defecto y habilitacion de creacion de arcihvos
// Lo convierte todos los archivos qe se suban a req.files (LLegaran siempre a esa propiedad)
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo!',
            },
        });
    }

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(','),
            },
        });
    }

    if (req.files.archivos.length > 1) {
        // Itero multiples archivos
        req.files.archivos.forEach((archivo) => {
            const extension = archivo.mimetype.split('/')[1];

            if (extensionesValidas.indexOf(extension) < 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Las extensiones permitidas son: ' + extensionesValidas.join(','),
                        ext: extension,
                    },
                });
            }

            // Cambiar nombre del archivo
            const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

            archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
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
        const archivoEjemplo = req.files.archivos;

        const extension = archivoEjemplo.mimetype.split('/')[1];

        if (extensionesValidas.indexOf(extension) < 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son: ' + extensionesValidas.join(','),
                },
            });
        } else {
            // Cambiar nombre del archivo
            const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

            archivoEjemplo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                }

                if (tipo === 'usuarios') {
                    imagenUsuario(id, res, nombreArchivo);
                } else {
                    imagenProducto(id, res, nombreArchivo);
                }
            });
        }
    }
});

module.exports = app;
