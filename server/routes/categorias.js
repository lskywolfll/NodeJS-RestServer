const express = require('express');
const app = express();
// Toma de valores especifidos mediante una funcion
const _ = require('underscore');
const { verficarToken, verificarAdmin_Role } = require('../middleware/autenticacion');
const Categoria = require('../models/categorias');
// Funciones del tiempo
const { Fecha_Formatear } = require('../Controllers/ControladorDeTiempo');

// Todas Las categorias
app.get('/categorias', (req, res) => {
    Categoria.find({}, 'tipo descripcion fecha usuario')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                categorias
            });
        });
});
// Mostrar una categoria por id
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById
    const id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
// Actualizar una Categoria por id
app.put('/categoria/:id', verficarToken,(req, res) => {
    const id = req.params.id;
    let body = _.pick(req.body, ['tipo', 'descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categodiaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            categoria: categodiaDB
        });
    });
});
// Crear una Categoria
app.post('/categoria', verficarToken, (req, res) => {
    // Registro de que usuario lo ha creado

    const fecha = Fecha_Formatear(new Date());

    const categoria = new Categoria({
        tipo: req.body.tipo,
        descripcion: req.body.descripcion,
        fecha: fecha,
        usuario: req.usuario.nombre
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
// Eliminar una categoria y que solo pueda borrar un administrador
app.delete('/categoria/:id', [verficarToken, verificarAdmin_Role],(req, res) => {
    // Categoria.findByIdAndRemove
    const id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err || !categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;