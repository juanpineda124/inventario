const express = require('express');
const { getConnection } = require('./db/connect-mongo');
const cors = require('cors');
require('dotenv').config();
const { router } = require('express');

const app = express();
const host = '0.0.0.0';
const port = process.env.PORT;

app.use(cors());

getConnection();

//parseo json
app.use(express.json());

app.use('/usuario', require('./router/usuario'));
app.use('/marca', require('./router/marca'));
app.use('/tipo-equipo', require('./router/tipoEquipo'));
app.use('/estado-equipo', require('./router/estadoEquipo'));
app.use('/inventario', require('./router/inventario'));
app.use('/auth', require('./router/auth'));

app.listen(port, host, () => {
    console.log(`Example app listening on port ${port}`)
});