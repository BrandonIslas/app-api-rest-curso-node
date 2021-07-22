const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express= require('express');
const app =express();
const config = require('config');
const morgan = require('morgan');

const usuarios = require('./routes/usuarios');

//Middlewares propios de express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);
//Configuracion de entornos
console.log('Aplicacion:' +config.get('name'));
console.log('Base de Datos Server: ' + config.get('configDB.host'))

//Middlewares de terceros
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    debug('Morgan esta habilitado');
}

//Trabajos con la Bd
//debug('conectando con la BD');

app.get('/', (req, res)=>{
    res.send("Hola Mundo desde Express");
});

const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto: ${port}`);
});

