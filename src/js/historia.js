(function () {
    document.addEventListener('DOMContentLoaded', function () {

        const btnsEliminar = document.querySelectorAll('.table__formulario--eliminar-historia');

        if (btnsEliminar.length > 0) {
            btnsEliminar.forEach(div => {
                const btn = div.querySelector('.table__accion--eliminar');
                const id = div.dataset.id;

                btn.addEventListener('click', function () {
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: 'Esta acción no se puede deshacer.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch(`/admin/historyteling/eliminar?id=${id}`, {
                                method: 'POST'
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.ok) {
                                    Swal.fire('Eliminado', 'La historia fue eliminada correctamente.', 'success')
                                        .then(() => location.reload());
                                } else {
                                    Swal.fire('Error', 'No se pudo eliminar la historia.', 'error');
                                }
                            })
                            .catch(() => {
                                Swal.fire('Error', 'Error de red o del servidor.', 'error');
                            });
                        }
                    });
                });
            });
        }

    });
})();
