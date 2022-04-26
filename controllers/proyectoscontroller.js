const Proyectos = require ('../models/Proyectos');
const Tareas = require ('../models/Tareas');

exports.ProyectosHome = async (req, res) => {
    //console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: {usuarioId}});
    res.render ('index', {
        nombrePagina : 'Inicio',
        proyectos
    });
}

exports.FormularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: {usuarioId}});

    res.render ('nuevoProyecto', {
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
}

exports.NuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: {usuarioId}});
    //enviar a la consola lo q el usuario escriba
    //console.log(req.body);

    //validar q tengamos algo en el input
    const { nombre } = req.body;

    let errores = [];

    if(!nombre){ 
        errores.push({'texto': 'Agrega un nombre al proyecto'})
    } 

    //si hay errores

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{
        //no hay errores
        //insertar en la BD con async y await
        const usuarioId = res.locals.usuario.id;
        const proyecto = await Proyectos.create({ nombre, usuarioId});
        res.redirect ('/index');

        //insertar en la BD sin async y await
        //console log para comprobar q funciona correctamente sin el async y await 
        //Proyectos.create({ nombre })
            //.then(() => console.log('insertado correctamente'))
            //.catch( error => console.log(error));
    }

}

exports.proyectoPorUrl = async (req, res, next ) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: {usuarioId}});
    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    const[proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {proyectoId : proyecto.id},
        include: [
            {model : Proyectos}
        ]
    });

    if (!proyecto) return next();

    //render a la vista
    res.render ('tareas', {
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) =>{
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({ where: {usuarioId}});
    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });
    const[proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: {usuarioId}});


    //validar q tengamos algo en el input
    const { nombre } = req.body;

    let errores = [];

    if(!nombre){ 
        errores.push({'texto': 'Agrega un nombre al proyecto'})
    } 

    //si hay errores

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    }else{

        await Proyectos.update( 
            {nombre: nombre},
            {where: {id: req.params.id} }
         );

        res.redirect ('/index');

    }

}

exports.eliminarProyecto = async(req,res,next) => {

    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('the Proyecto a sido Eliminado');
}