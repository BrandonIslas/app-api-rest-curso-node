const express = require('express');
const Joi = require('joi');
const ruta = express.Router();

const Usuarios =[
    {id:1, nombre:'Brandon'},
    {id:2, nombre:'Juan'},
    {id:3, nombre:'Pedro'}
];

ruta.get('/', (req, res)=>{
    res.send(Usuarios);
});

ruta.get('/:id', (req, res)=>{
    let usuario=existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no Encontrado')
    }
    res.send(usuario)
});

ruta.post('/', (req, res)=>{

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

ruta.put('/:id',(req, res) =>{
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

ruta.delete('/:id',(req, res) =>{
    let usuario= existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('Usuario no Encontrado');
        return;
    }
    const index= Usuarios.indexOf(usuario);
    Usuarios.splice(index, 1);
    res.send(Usuarios);
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

module.exports = ruta;