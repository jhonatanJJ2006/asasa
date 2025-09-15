(function () {

    // Botones
    const btnsEliminar = document.querySelectorAll(".table__formulario--eliminar-about");

    if(btnsEliminar) {

        btnsEliminar.forEach(btn => {
            btn.addEventListener("click", () => {
                let id = btn.dataset.id;

                Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        
                        const data = new FormData();
                        data.append('id', id);

                        fetch(`/admin/about/eliminar`, {
                            method: 'POST',
                            body: data
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.ok) {
                                    Swal.fire('Eliminado', 'Información eliminada de la tabla correctamente', 'success')
                                        .then(() => location.reload());
                                } else {
                                    Swal.fire('Error', 'No se pudo eliminar la información.', 'error');
                                }
                            })
                            .catch(() => {
                                Swal.fire('Error', 'Error de red o del servidor.', 'error');
                            });
                    }
                });

            })
        })

    }

    

})();
