const jwt = require('jsonwebtoken');

const validateRolAdmin = (req, res, next) => {
    if (req.payload.rol != 'Administrador'){
        return res.status(401).json({ mansaje: 'Error unauthorized' });
    }
    next();
}

module.exports = {
    validateRolAdmin
}