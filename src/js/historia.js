(function () {
    document.addEventListener('DOMContentLoaded', function () {

        const btnsEliminar = document.querySelectorAll('.table__formulario--eliminar-historia');

        if (btnsEliminar.length > 0) {
            btnsEliminar.forEach(btn => {
                const id = btn.dataset.id;

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
                                if (data) {
                                    Swal.fire('Eliminado', 'La historia fue eliminada correctamente.', 'success')
                                        .then(() => location.reload());
                                } else {
                                    window.location.reload();
                                    Swal.fire('Error', 'No se pudo eliminar la historia.', 'error');
                                }
                            })
                            .catch(error => {
                                window.location.reload();
                            });
                        }
                    });
                });
            });
        }

    });
})();
