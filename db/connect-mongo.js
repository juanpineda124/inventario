const mongoose = require('mongoose');

const getConnection = async () => {

    try {

        const url = 'mongodb://gabrielpineda:q10KUuquygwWfApz@ac-bhle532-shard-00-00.ka7rkhy.mongodb.net:27017,ac-bhle532-shard-00-01.ka7rkhy.mongodb.net:27017,ac-bhle532-shard-00-02.ka7rkhy.mongodb.net:27017/jwt-inventario?ssl=true&replicaSet=atlas-1170jt-shard-0&authSource=admin&retryWrites=true&w=majority'

        await mongoose.connect(url);

        console.log('conexion exitosa');

    } catch (error) {
        console.log(error);
    }

    
}

module.exports = {
    getConnection
}