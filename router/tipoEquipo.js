const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
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

        let tipo = new TipoEquipo();
        tipo.nombre = req.body.nombre;
        tipo.estado = req.body.estado;
        tipo.fechaCreacion = new Date();
        tipo.fechaActualizacion = new Date();

        tipo = await tipo.save();
        res.send(tipo);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al crear el tipo equipo')
    }
});

router.get('/', [validateJWT, validateRolAdmin],  async function(req, res) {
    try {
        const tipos = await TipoEquipo.find();
        res.send(tipos);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al listar los tipos de equipos')
    }

});

router.delete('/:id', [validateJWT, validateRolAdmin], async function (req, res) {
    try{
        const{id} = req.params
        const tipo = await TipoEquipo.findByIdAndDelete({_id: id})
        res.send(tipo);
    }catch(error){
        res.status(500).send('Ocurrio un error al eliminar el tipo equipo') 
     }
});

router.put('/:tipoId', [validateJWT, validateRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn([ 'Activo', 'Inactivo']),
], async function (req, res) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        let tipo = await TipoEquipo.findById(req.params.tipoId);
        if(!tipo){
            return res.status(400).send('Tipo equipo no existe');
        }
     
        tipo.nombre = req.body.nombre;
        tipo.estado = req.body.estado;
        tipo.fechaActualizacion = new Date();

        tipo = await tipo.save();
        res.send(tipo);

    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error al actualizar el tipo equipo') 
    }
});

module.exports = router;