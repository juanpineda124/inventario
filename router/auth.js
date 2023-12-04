const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const router = Router();

router.post('/', [
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
], async function(req, res) {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        const usuario = await Usuario.findOne({ email: req.body.email })
        if(!usuario) {
            return res.status(400).json({ mensaje: 'User no found' });
        }

        //Validar contraseña
        const esigual = bycript.compareSync(req.body.password, usuario.password);
        if (!esigual) {
            return res.status(400).json({ mensaje: 'user no found' });
        }

        //Generar token
        const token = generarJWT(usuario);

        res.json({
            _id: usuario._id, nombre: usuario.nombre,
            rol: usuario.rol, email: usuario.email,
            access_token: token
        });

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al autenticar el usuario')
    }
});

module.exports = router;