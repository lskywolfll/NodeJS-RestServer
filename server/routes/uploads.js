const express = require('express');
const fs = require('fs');
// middleware automatico para poder subir archivos
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express();
const { verficarToken } = require('../middleware/autenticacion');

const extensionesValidas = ['jpg', 'png', 'pdf', 'jpeg'];
// opciones por defecto y habilitacion de creacion de arcihvos 
// Lo convierte todos los archivos qe se suban a req.files (LLegaran siempre a esa propiedad)
app.use(fileUpload({ useTempFiles: true }));

app.post('/upload', (req, res) => {

    let tieneComentarios = false;

    // console.log(req.files);
    // console.log(req.body);

    if (req.body.comentarios && req.body.comentarios != 'null' && req.body.comentarios != null) {
        tieneComentarios = true;
        req.body.comentarios = JSON.parse(req.body.comentarios)

        // req.body.comentarios.forEach(element => {
        //     console.log('dentro del foreach');
        //     console.log(element);
        // });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo!'
            }
        })
    }

    let nombreFalse = req.body.idUsuario;

    let carpetaDestino = path.join(__dirname.split('server')[0] + `uploads/usuarios/${nombreFalse}`);

    let estadoCarpeta = fs.existsSync(carpetaDestino);
    
    fs.mkdirSync(carpetaDestino, { recursive: true }, (err) => {
        if (err) throw err;

        console.log('se ha creado exitosamente');
    });


    if (req.files.archivos.length > 1) {
        // Itero multiples archivos
        req.files.archivos.forEach(archivo => {
            let extension = archivo.mimetype.split('/')[1];

            if (extensionesValidas.indexOf(extension) < 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Las extensiones permitidas son: ' + extensionesValidas.join(',')
                    }
                });
            }

            if (tieneComentarios) {
                req.body.comentarios.forEach(element => {
                    if (element.comentario) {
                        let ubicacionArchivo = carpetaDestino + `/${element.comentario}`;
                        fs.mkdirSync(ubicacionArchivo, { recursive: true }, (err) => {
                            if (err) throw err;

                            console.log('Se creo correctamente');
                        });

                        element.archivosAsociados.forEach(nombres => {
                            if (nombres == archivo.name) {
                                archivo.mv(`${ubicacionArchivo}/${archivo.name}`, (err) => {
                                    if (err) throw err;

                                    console.log('paso');
                                });
                            }
                        });
                    }
                });
            } else {
                archivo.mv(`${carpetaDestino}/${archivo.name}`, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                })
            }
        });

        return res.status(200).json({
            ok: true,
            message: 'Se ha subido correctamente',
            archivos: req.files.archivos
        });
    } else {
        let archivoEjemplo = req.files.archivos;

        let extension = archivoEjemplo.mimetype.split('/')[1];

        if (extensionesValidas.indexOf(extension) < 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son: ' + extensionesValidas.join(',')
                }
            });
        } else {
            fs.mkdirSync(carpetaDestino, { recursive: true }, (err) => { if (err) throw err; });

            if (tieneComentarios) {
                req.body.comentarios.forEach(element => {
                    // console.log(element);
                    if (element.comentario) {
                        let ubicacionArchivo = carpetaDestino + `/${element.comentario}`
                        fs.mkdirSync(ubicacionArchivo, { recursive: true }, (err) => {
                            if (err) throw err;

                            console.log('Se creo correctamente');
                        })

                        element.archivosAsociados.forEach(nombres => {
                            if (nombres == archivoEjemplo.name) {
                                archivoEjemplo.mv(`${ubicacionArchivo}/${archivoEjemplo.name}`, (err) => {
                                    if (err) throw err;

                                    console.log('paso');
                                })
                            }
                        });
                    }
                });

                return res.status(200).json({
                    ok: true,
                    message: 'Se ha subido correctamente 1',
                    detalles: {
                        name: archivoEjemplo.name,
                        extension: archivoEjemplo.mimetype
                    }
                });
            } else {
                archivoEjemplo.mv(`${carpetaDestino}/${archivoEjemplo.name}`, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    return res.status(200).json({
                        ok: true,
                        message: 'Se ha subido correctamente v2',
                        detalles: {
                            name: archivoEjemplo.name,
                            extension: archivoEjemplo.mimetype
                        }
                    });
                })
            }
        }
    }
});

module.exports = app