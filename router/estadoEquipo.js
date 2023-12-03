const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validationResult, check } = require('express-validator');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.post('/', [validateJWT, validateRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn([ 'Activo', 'Inactivo']),
], async function(req, res) {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        let estado = new EstadoEquipo();
        estado.nombre = req.body.nombre;
        estado.estado = req.body.estado;
        estado.fechaCreacion = new Date();
        estado.fechaActualizacion = new Date();

        estado = await estado.save();
        res.send(estado);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al crear el estado del equipo')
    }
});

router.get('/', [validateJWT, validateRolAdmin], async function(req, res) {
    try {
        const estados = await EstadoEquipo.find();
        res.send(estados);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al listar los estados de equipos')
    }

});

router.delete('/:id', [validateJWT, validateRolAdmin], async function (req, res) {
    try{
        const{id} = req.params
        const estado = await EstadoEquipo.findByIdAndDelete({_id: id})
        res.send(estado);
    }catch(error){
        res.status(500).send('Ocurrio un error al eliminar el tipo equipo') 
     }
});

router.put('/:estadoId', [validateJWT, validateRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn([ 'Activo', 'Inactivo']),
], async function (req, res) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        let estado = await EstadoEquipo.findById(req.params.estadoId);
        if(!estado){
            return res.status(400).send('estado equipo no existe');
        }
     
        estado.nombre = req.body.nombre;
        estado.estado = req.body.estado;
        estado.fechaActualizacion = new Date();

        estado = await estado.save();
        res.send(estado);

    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error al actualizar el tipo equipo') 
    }
});

module.exports = router;