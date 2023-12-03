const { Router } = require('express');
const Inventario = require('../models/Inventario');
const { validationResult, check } = require('express-validator');
const { validateJWT } = require('../middleware/validar-jwt');
const { validateRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.post('/',[validateJWT, validateRolAdmin], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
], async function(req, res) {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

       const existeIventarioPorSerial = await Inventario.findOne({ serial: req.body.serial });
       if(existeIventarioPorSerial){
        return res.status(400).send('Ya existe el serial para otro equipo');
       }
       let inventario = new Inventario();
       inventario.serial = req.body.serial;
       inventario.modelo = req.body.modelo;
       inventario.descripcion = req.body.descripcion;
       inventario.foto = req.body.foto;
       inventario.color = req.body.color;
       inventario.fechaCompra = req.body.fechaCompra;
       inventario.precio = req.body.precio;
       inventario.usuario = req.body.usuario._id;
       inventario.marca = req.body.marca._id;
       inventario.tipoEquipo = req.body.tipoEquipo._id;
       inventario.estadoEquipo = req.body.estadoEquipo._id;
       inventario.fechaCreacion = new Date();
       inventario.fechaActualizacion = new Date();

       inventario = await inventario.save();
       res.send(inventario);       


    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al crear la marca')
    }

});

router.get('/', validateJWT, async function(req, res) {
    try {
        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado'
            },
            {
                path: 'marca', select: 'nombre estado' 
            },
            {
                path: 'tipoEquipo', select: 'nombre estado' 
            },
            {
                path: 'estadoEquipo', select: 'nombre estado' 
            }
        ]);
        res.send(inventarios);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrio un error al listar los inventarios')
    }
});

router.delete('/:id', [validateJWT, validateRolAdmin], async function (req, res) {
    try{
        const{id} = req.params
        const inventario = await Inventario.findByIdAndDelete({_id: id})
        res.send(inventario);
    }catch(error){
        res.status(500).send('Ocurrio un error al eliminar la marca') 
     }
});

router.put('/:inventarioId', [validateJWT, validateRolAdmin], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
], async function (req, res) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ mansaje: errors.array() });
        }

        let inventario = await Inventario.findById(req.params.inventarioId);
        if(!inventario){
            return res.status(400).send('Inventario no existe');
        }
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaActualizacion = new Date();
 
        inventario = await inventario.save();
        res.send(inventario); 

    }catch(error){
        console.log(error)
        res.status(500).send('Ocurrio un error al actualizar el tipo equipo') 
    }
});

module.exports = router;