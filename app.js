const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express= require('express');
const app =express();
const config = require('config');
const Joi = require('joi');
const morgan = require('morgan');

const Usuarios =[
    {id:1, nombre:'Brandon'},
    {id:2, nombre:'Juan'},
    {id:3, nombre:'Pedro'}
];
//Middlewares propios de express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

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

app.get('/api/usuarios', (req, res)=>{
    res.send(Usuarios);
});

app.get('/api/usuarios/:id', (req, res)=>{
    let usuario=existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no Encontrado')
    }
    res.send(usuario)
});

app.post('/api/usuarios', (req, res)=>{

    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    })
    const {error, value} = validarUsuario(req.body.nombre);

    if(!error){
        const usuario={
            id: Usuarios.length +1,
            nombre: value.nombre
        };
        Usuarios.push(usuario);
        res.send(usuario)
    }else{
        const mensaje= error.details[0].message;
        console.log(error)
        res.status(400).send(mensaje)
    }
})

app.put('/api/usuarios/:id',(req, res) =>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no Encontrado');
        return;
    }
    const {error, value} = validarUsuario(req.body.nombre);
    if(error){
        const mensaje= error.details[0].message;
        console.log(error)
        res.status(400).send(mensaje)
        return;
    }
    usuario.nombre= value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id',(req, res) =>{
    let usuario= existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no Encontrado');
        return;
    }
    const index= Usuarios.indexOf(usuario);
    Usuarios.splice(index, 1);
    res.send(Usuarios);
});

const port= process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto: ${port}`);
});

function existeUsuario(id){
    return(Usuarios.find(u=> u.id ===parseInt(id)));
}

function validarUsuario(nom){
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({nombre: nom}));
}