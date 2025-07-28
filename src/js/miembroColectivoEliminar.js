(function () {

    const btnsEliminar = document.querySelectorAll('.table__formulario--eliminar-miembro');

    if (btnsEliminar.length > 0) {
        btnsEliminar.forEach(btnEliminar => {
            btnEliminar.addEventListener('click', () => {
                const id = btnEliminar.dataset.id;

                if (!id) return;

                Swal.fire({
                    icon: 'warning',
                    title: '¿Estás seguro?',
                    text: 'Esta acción no se puede deshacer',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then(result => {
                    if (result.isConfirmed) {
                        const data = new FormData();
                        data.append('id', id);

                        fetch('/admin/miembrosColectivo/eliminar', {
                            method: 'POST',
                            body: data
                        })
                            .then(res => res.json())
                            .then(response => {
                                if (response.ok) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Miembro eliminado correctamente',
                                        confirmButtonText: 'Aceptar'
                                    }).then(() => {
                                        window.location.href = '/admin/miembrosColectivo';
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error al eliminar',
                                        text: response.message || 'No se pudo eliminar el miembro.'
                                    });
                                }
                            })
                            .catch(error => {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error de red',
                                    text: 'Verifica tu conexión o contacta soporte.'
                                });
                            });
                    }
                });
            });
        });
    }

})();

