import Swal from "sweetalert2";
import axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar){

    btnEliminar.addEventListener('click', e => {

        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: 'Desea eliminar este Proyecto?',
            text: "un proyecto eliminado no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'SIII, Eliminame!',
            cancelButtonText: 'Nooo, No me Elimines!'
          }).then((result) => {
            if (result.isConfirmed) {
                //enviar peticion a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, {params: {urlProyecto}})
                    .then(function(respuesta){
                            
                        Swal.fire(
                            'Eliminated!',
                            respuesta.data,
                            'success'
                          );
                
                        //redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/index'
                        }, 3000);

                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo Eliminar',
                            timer: 4000
                        })
                    })

            }
          })})


}

export default btnEliminar;
