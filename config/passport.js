const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo donde vamos a autentificar al usuario
const Usuarios =  require('../models/Usuarios');

//login con credenciales propias (usuario y password)
passport.use(new LocalStrategy(
    //por defaul passport espera un usuario y password
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done) => {
        try{
            const usuario = await Usuarios.findOne({
                where: { 
                    email : email,
                    activo : 1 
                }
            });
            //correo bien, password mal
            if(!usuario.verificarPassword(password)){
                return done(null, false,{
                    message: 'Password incorrecto'
                })
            }

            //email bien, pass bien
            return done(null, usuario);

        }
        catch(error){
            //usuario no existe
            return done(null, false,{
                message: 'Correo no registrado'
            })

        }

    }  
  ));

  //serializar el user
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

  //deserializar el user
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

//exportar
module.exports = passport;