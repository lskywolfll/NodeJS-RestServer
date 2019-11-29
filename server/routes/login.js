const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

app.post('/Login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    Usuario.findOne({ email: email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrrectos'
                }
            });
        }

        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
                ok: true,
                message: 'Usuario o contraseña incorrrectos'
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, 
        'secret'
        ,{
            expiresIn: process.env.CADUCIDAD_TOKEN
        });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;