import Swal from "sweetalert2";

export const actualizarAvance = () => {

    //Seleccionar las tareas existentes

    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length){
        //Seleccionar las tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');

        //Calcular el Avance
        const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

        //Mostrar Avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if(avance == 100 ){
            Swal.fire(
                'Proyecto Completado',
                'Enhorabuena',
                'success'
              )
        }

    }
}