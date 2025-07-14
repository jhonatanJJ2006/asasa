(function () {

    const nombre = document.querySelector('#nombre');
    const descripcion = document.querySelector('#descripcion');
    const fecha = document.querySelector('#fecha');
    const hora = document.querySelector('#hora');
    const tipo = document.querySelector('#tipo');
    const lugar = document.querySelector('#lugar');

    const btn = document.querySelector('.formulario-administrador__boton--evento');
    const btnEditar = document.querySelector('.formulario-administrador__boton--evento-editar');

    if (btn) {

        btn.addEventListener('click', () => {

            errores = [];

            comprobarDatos();

            if (errores.length === 0) {

                subirDatos();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Errores en el formulario',
                    html: `
                        <ul class="alerta__contenedor" style="text-align: left; margin: 0 auto;">
                            ${errores.map(error => `<li class="alerta alerta__error" style="margin-bottom: 5px;">${error}</li>`).join('')}
                        </ul>
                    `,
                    confirmButtonText: 'Corregir',
                    customClass: {
                        confirmButton: 'swal2-confirm btn-purple'
                    }
                });

            }


        });

        function subirDatos() {

            const formData = new FormData();
            formData.append('nombre', nombre.value.trim());
            formData.append('descripcion', descripcion.value.trim());
            formData.append('fecha', fecha.value.trim());
            formData.append('hora', hora.value.trim());
            formData.append('tipo', tipo.value.trim());
            formData.append('lugar', lugar.value.trim());

            fetch('/admin/agenda/crear/cargar', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'El evento fue guardado correctamente.',
                            confirmButtonText: 'Ir a la agenda'
                        }).then(() => {
                            location.href = '/admin/agenda';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al guardar el evento. Intenta de nuevo.',
                            confirmButtonText: 'Entendido'
                        });
                    }

                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'No se pudo conectar con el servidor.',
                        confirmButtonText: 'Cerrar'
                    });
                });

        }

    }

    if (btnEditar) {

        btnEditar.addEventListener('click', () => {

            errores = [];

            comprobarDatos();

            if (errores.length === 0) {

                subirDatos();

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Errores en el formulario',
                    html: `
                        <ul class="alerta__contenedor" style="text-align: left; margin: 0 auto;">
                            ${errores.map(error => `<li class="alerta alerta__error" style="margin-bottom: 5px;">${error}</li>`).join('')}
                        </ul>
                    `,
                    confirmButtonText: 'Corregir',
                    customClass: {
                        confirmButton: 'swal2-confirm btn-purple'
                    }
                });

            }

        });

        function subirDatos() {

            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');
            const formData = new FormData();
            formData.append('nombre', nombre.value.trim());
            formData.append('descripcion', descripcion.value.trim());
            formData.append('fecha', fecha.value.trim());
            formData.append('hora', hora.value.trim());
            formData.append('tipo_reunion', tipo.value.trim());
            formData.append('lugar', lugar.value.trim());
            formData.append('id', id);

            fetch('/admin/agenda/editar/cargar', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Éxito!',
                            text: 'El evento fue actualizado correctamente.',
                            confirmButtonText: 'Ir a la agenda'
                        }).then(() => {
                            location.href = '/admin/agenda';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al guardar el evento. Intenta de nuevo.',
                            confirmButtonText: 'Entendido'
                        });
                    }

                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'No se pudo conectar con el servidor.',
                        confirmButtonText: 'Cerrar'
                    });
                });

        }

    }

    const btnsEliminar = document.querySelectorAll('.table__formulario--eliminar-evento');

    if (btnsEliminar.length > 0) {
        btnsEliminar.forEach(btn => {
            const id = btn.dataset.id;

            btn.addEventListener('click', function (e) {
                e.preventDefault(); // evitar envío del form en caso de estar dentro

                Swal.fire({
                    title: '¿Estás seguro?',
                    text: 'Esta acción no se puede deshacer.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetch(`/admin/agenda/eliminar?id=${id}`, {
                            method: 'POST'
                        })
                            .then(res => res.json())
                            .then(data => {
                                if (data.ok) {
                                    Swal.fire('Eliminado', 'El evento fue eliminado correctamente.', 'success')
                                        .then(() => location.reload());
                                } else {
                                    Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
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

    function comprobarDatos() {

        if (nombre.value.trim() === '') {
            errores.push('El nombre del evento es obligatorio');
        }
        if (descripcion.value.trim() === '') {
            errores.push('La descripción del evento es obligatoria');
        }
        if (descripcion.value.trim().length < 30) {
            errores.push('La descripción del evento debe contener almenos 30 caracteres');
        }
        if (fecha.value.trim() === '') {
            errores.push('La fecha del evento es obligatoria');
        }
        if (hora.value.trim() === '') {
            errores.push('La hora del evento es obligatoria');
        }
        if (tipo.value.trim() === '') {
            errores.push('El tipo de evento es obligatorio');
        }
        if (lugar.value.trim() === '') {
            errores.push('El lugar del evento es obligatorio');
        }

    }

})();