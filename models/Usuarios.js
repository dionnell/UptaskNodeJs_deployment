const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require ('./Proyectos');
const bcrypt = require('bcrypt-nodejs');


const Usuarios = db.define('usuarios', {

    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type:Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'Ingrese una contraseña'
            }
        },
        unique: {
            args: true,
            msg: 'El correo ya existe'
        }
        
    },
    password: {
        type:Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty: {
                msg: 'Ingrese una contraseña'
            }
        }
    },
    activo: {
        type:Sequelize.INTEGER(2),
        defaultValue: 0,
    },
    token: Sequelize.STRING(60),
    expiracion: Sequelize.DATE()

}, {
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
        }
    }
});

//metodos personalizados
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;