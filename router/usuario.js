const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bycript = require('bcryptjs');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.post('/',[validateJWT, validateRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn([ 'Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn([ 'Administrador', 'Docente']),
], async function(req, res) {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email })
        if(existeUsuario) {
            return res.status(400).send('Email ya exisye');
        }
        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.rol = req.body.rol;

        const salt = bycript.genSaltSync();
        const password = bycript.hashSync(req.body.password, salt);
        usuario.password = password;

        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        res.send(usuario);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al crear el usuario')
    }
});

router.get('/', [validateJWT, validateRolAdmin],  async function(req, res) {
    try {
        const usuarios = await Usuario.find();
        res.send(usuarios);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al listar los usuarios')
    }

});

router.delete('/:id', [validateJWT, validateRolAdmin], async function (req, res) {
    try{
        const{id} = req.params
        const usuario = await Usuario.findByIdAndDelete({_id: id})
        res.send(usuario);
    }catch(error){
        res.status(500).send('Ocurrio un error al eliminar el usuario') 
     }
});

router.put('/:usuarioId', [validateJWT, validateRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('estado', 'invalid.estado').isIn([ 'Activo', 'Inactivo']),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn([ 'Administrador', 'Docente']),
], async function (req, res) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        let usuario = await Usuario.findById(req.params.usuarioId);
        if(!usuario){
            return res.status(400).send('Usuario no existe');
        }
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.rol = req.body.rol;

        const salt = bycript.genSaltSync();
        const password = bycript.hashSync(req.body.password, salt);
        usuario.password = password;


        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        res.send(usuario);

    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error al actualizar el usuario') 
    }
});

module.exports = router;