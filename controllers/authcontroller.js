const passport = require('passport');
const Usuarios = require ('../models/Usuarios');
const crypto = require('crypto');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');
const flash = require('connect-flash/lib/flash');
const enviarEmail = require('../handlers/email');

//autenticar usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMesagge: 'usuario y password vacios'
});

//funcion para revisar si el usuario esta logueado o no 

exports.usuarioAutenticado = (req, res, next) => {

    //si el usuario esta autenticado, acceso a la pag

    if(req.isAuthenticated()){
        return next();
    }

    //si el usuario no esta autenticado, redirigir a inicio de sesion
    return res.redirect('/iniciar-sesion');
}

//funcion para cerrar sesion 

exports.cerrarSesion = (req, res) => {

    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //al cerrar sesion, nos lleva al login
    });

}

//genera un token si el usuario es valido

exports.enviarToken = async(req, res) => {
    
    //Verificar q el usuario existe
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where : { email }});
    
    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'No existe ese correo');
        res.redirect ('/reestablecer');
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000 ;

    //guardarlos en la BD
    await usuario.save();

    //Url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //console.log(resetUrl);
    //envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset', 
        resetUrl,
        archivo: 'reestablecer-password'
    })
    //terminar accion
    req.flash('correcto','Se envio un mensaje a su correo');
    res.redirect('/iniciar-sesion');

}

exports.validarToken = async(req, res) => {

    const usuario = await Usuarios.findOne({
        where : { 
            token : req.params.token 
        }
    });

    //si no hay usuario 
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //Formulario para generar el password
    res.render ('resetPassword', {
        nombrePagina : 'Reestablecer contraseña',
    });

}

//cambiar password por uno nuevo

exports.actualizarPassword = async(req, res) => {

    //verifica token y fecha de expiracion
    const usuario = await Usuarios.findOne({
        where : {
            token : req.params.token,
            expiracion : {
                [Op.gte] : Date.now()
            }
        }
    });

    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //hashear el nuevo pass
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;

    //guardar el nuevo password
    await usuario.save();
    req.flash('correcto', 'Su Password a sido modificada correctamente')
    res.redirect('/iniciar-sesion');

}