const { Router } = require('express');
const Marca = require('../models/Marca');
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

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save();
        res.send(marca);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al crear la marca')
    }
});

router.get('/', [validateJWT, validateRolAdmin], async function(req, res) {
    try {
        const marcas = await Marca.find();
        res.send(marcas);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al listar las marcas')
    }

});

router.delete('/:id', [validateJWT, validateRolAdmin], async function (req, res) {
    try{
        const{id} = req.params
        const marca = await Marca.findByIdAndDelete({_id: id})
        res.send(marca);
    }catch(error){
        res.status(500).send('Ocurrio un error al eliminar la marca') 
     }
});

router.put('/:marcaId', [validateJWT, validateRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn([ 'Activo', 'Inactivo']),
], async function (req, res) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        let marca = await Marca.findById(req.params.marcaId);
        if(!marca){
            return res.status(400).send('Marca no existe');
        }
     
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();

        marca = await marca.save();
        res.send(marca);

    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error al actualizar la marca') 
    }
});

module.exports = router;