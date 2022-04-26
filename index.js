const express = require ('express');
const router = require ('./rutas');
const path = require ('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//extraer las variables de entorno del archivo .env
require('dotenv').config({path:'variables.env'});

//helpers con algunas funciones
const helpers = require('./helpers');

//crear conexcion a la BD
const db = require('./config/db');

//importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');



db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch((error) => console.log(error));


//crear app de express
const app = express();

//donde cargar los css o js
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitar el body parser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//agregamos express validator a toda la aplicacion
//app.use(expressValidator());


//añadir capeta de las vistas  o templates
app.set('views', path.join(__dirname, './views'));


app.use(cookieParser());


//session q nos permite navegar en distintas pag sin volver a iniciar sesion
app.use(session({
    secret: "Keyboard cat",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//agregar Flash messages
app.use(flash());

//pasar var dump a la aplicacioon
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    //console.log(res.locals.usuario); //muestra en consola la info del usuario logueado
    next();
});



app.use('/', router() );

//usa el puerto 3000
//app.listen (3000);

//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000 ;

app.listen (port, host, () => {
    console.log('El servidor funciona correctamente');
});
