const express = require ('express');
const router = express.Router();

//importar express validator para sanitizar entradas de datos
const{body} = require('express-validator');

//importar el controlador
const proyectoscontroller = require('../controllers/proyectoscontroller');
const tareascontroller = require('../controllers/tareascontroller');
const usuarioscontroller = require('../controllers/usuarioscontroller');
const authcontroller = require('../controllers/authcontroller');
const { Router } = require('express');

module.exports = function() {

    //ruta home
    router.get('/index', 
        authcontroller.usuarioAutenticado,
        proyectoscontroller.ProyectosHome);
    router.get('/nuevo-proyecto', 
        authcontroller.usuarioAutenticado, 
        proyectoscontroller.FormularioProyecto);
    router.post('/nuevo-proyecto', 
        authcontroller.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectoscontroller.NuevoProyecto
    );

    //listar proyecto
    router.get('/proyectos/:url',
        authcontroller.usuarioAutenticado,  
        proyectoscontroller.proyectoPorUrl);

    //Actualizar el Proyecto
    router.get('/proyecto/editar/:id', 
        authcontroller.usuarioAutenticado, 
        proyectoscontroller.formularioEditar);
    router.post('/nuevo-proyecto/:id', 
        authcontroller.usuarioAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),
        proyectoscontroller.actualizarProyecto
    );

    //eliminar proyecto
    router.delete('/proyectos/:url',
        authcontroller.usuarioAutenticado, 
        proyectoscontroller.eliminarProyecto);

    //Tareas
    router.post('/proyectos/:url',
        authcontroller.usuarioAutenticado, 
        tareascontroller.agregarTarea);

    //actualizar tarea
    //patch es como update pero actualiza solo una parte
    router.patch('/tareas/:id',
        authcontroller.usuarioAutenticado, 
        tareascontroller.cambiarEstado);
    //Eliminar tarea
    router.delete('/tareas/:id',
        authcontroller.usuarioAutenticado, 
        tareascontroller.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta',usuarioscontroller.formCrearCuenta);
    router.post('/crear-cuenta',usuarioscontroller.crearCuenta);
    router.get('/confirmar/:correo',usuarioscontroller.confirmarCuenta);

    //iniciar Sesion
    router.get('/iniciar-sesion',usuarioscontroller.formIniciarSesion);
    router.post('/iniciar-sesion',authcontroller.autenticarUsuario);

    //cerrar sesion
    router.get('/cerrar-sesion',authcontroller.cerrarSesion);

    //resstablecer contraseña
    router.get('/reestablecer',usuarioscontroller.formRestablecerPass);
    router.post('/reestablecer',authcontroller.enviarToken);
    router.get('/reestablecer/:token',authcontroller.validarToken);
    router.post('/reestablecer/:token',authcontroller.actualizarPassword);




    return router;

}
