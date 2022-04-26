const { Sequelize } = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shortid = require('shortid');

const Proyectos = db.define('proyectos',{
    
    //Id: {
    //    type: Sequelize.INTEGER,
    //    primeryKey: true,
    //},

    nombre:{
        type: Sequelize.STRING(150),
    },

    url:{
        type: Sequelize.STRING(100),
    }
}, {
    hooks: {
        beforeCreate(proyecto){
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url= `${url}-${shortid.generate()}`;
        }
        
    }
})

module.exports = Proyectos;