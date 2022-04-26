const Usuarios = require ('../models/Usuarios');
const enviarEmail = require('../handlers/email');


exports.formCrearCuenta = (req, res) => {

    res.render ('crearCuenta', {
        nombrePagina : 'Crear Cuenta'
    });
} 

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render ('iniciarSesion', {
        nombrePagina : 'Iniciar Sesion',
        error
    });
} 

exports.crearCuenta = async(req,res ) => {

    //leer datos
    const {email, password} = req.body;

    try{
    //crear usuario
        await Usuarios.create({
            email,
            password
        });

        //crear una Url de confirmacion
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta', 
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'enviamos un correo de confirmacion a su email');
        res.redirect('/iniciar-sesion');
    
    }catch(error){
        req.flash('error', error.errors.map(error => error.message));
        res.render ('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta',
            email,
            password
        });
    }
} 

exports.formRestablecerPass = (req, res) => {
    res.render ('reestablecer', {
        nombrePagina : 'Reestablece tu contraseña'
    });
} 

//cambia el estado de cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        Where : {
             email : req.params.correo
             }
        });

    //si no existe usuario
    if(!usuario){
        req.flash('error', 'no valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

} 