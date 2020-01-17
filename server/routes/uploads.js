const express = require('express');
// middleware automatico para poder subir archivos
const fileUpload = require('express-fileupload');
const app = express();

// opciones por defecto y habilitacion de creacion de arcihvos 
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload', (req, res) => {

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No seha seleccionado ningun archivo'
            }
        })
    }

    // el nombre del input del cual toma el archivo en la pagina web es el nombre en la cual llegada
    let archivoEjemplo = req.files.archivo;

    archivoEjemplo.mv(`uploads/${archivoEjemplo.name}`, (err) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Se ha subido correctamente',
            detalles: {
                name: archivoEjemplo.name,
                extension: archivoEjemplo.mimetype
            }
        });
    });
});

module.exports = app