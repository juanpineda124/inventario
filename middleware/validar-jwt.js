const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => { 
    const token = req.header('Authorization');
    if (!token) {
    return res.status(401).json({ mansaje: 'Error unauthotized' });
    }

    try {

        const payload = jwt.verify(token, '1234567');
        req.payload = payload;
        next();

    }catch (error){
        console.log(error);
        return res.status(401).json({ mansaje: 'Error unauthotized' });
    }
    
}
module.exports = {
    validateJWT
}