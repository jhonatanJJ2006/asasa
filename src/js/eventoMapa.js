(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const dropzone = document.getElementById('dropzone-img');
        const inputImagenes = document.getElementById('imagenes');
        const previewContainer = document.getElementById('imagenes-preview');
        const inputNombre = document.getElementById('nombre');
        const inputDescripcion = document.getElementById('descripcion');
        const inputFecha = document.getElementById('fecha');
        const inputItems = document.getElementById('items');
        const inputCiudad = document.getElementById('ciudad');

        // Botones
        const btnCrear = document.querySelector('.formulario-administrador__boton--mapa-crear');
        const btnEditar = document.querySelector('.formulario-administrador__boton--mapa-editar');
        const btnsEliminar = document.querySelectorAll('.table__formulario--eliminar-mapa');

        // Contador de imágenes actuales en edición (Swiper)
        let imagenesActuales = 0;
        const swiperAdmin = document.querySelector('.imagenes-swiper-admin');
        if (swiperAdmin) {
            imagenesActuales = swiperAdmin.querySelectorAll('.swiper-slide').length;
        }

        if (btnsEliminar) {
            btnsEliminar.forEach(btnEliminar => {
                btnEliminar.addEventListener('click', () => {
                    let id = btnEliminar.dataset.id;
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
                            fetch('/admin/mapa/eliminar', {
                                method: 'POST',
                                body: data
                            })
                                .then(res => res.json())
                                .then(response => {
                                    if (response.ok) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Evento eliminado correctamente',
                                            confirmButtonText: 'Aceptar'
                                        }).then(() => {
                                            window.location.href = '/admin/mapa';
                                        });
                                    } else {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error al eliminar',
                                            text: response.message || 'No se pudo eliminar el evento.'
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

        let errores = [];

        // Función para mostrar errores con SweetAlert2
        const mostrarErrores = (errores) => {
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
        };

        // Función para mostrar éxito
        const mostrarExito = (msg) => {
            Swal.fire({
                icon: 'success',
                title: '¡Evento guardado!',
                text: msg,
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = '/admin/mapa';
            });
        };

        if (!dropzone || !inputImagenes || !previewContainer) return;

        // Dropzone click
        dropzone.addEventListener('click', () => {
            inputImagenes.click();
        });

        // Drag & Drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
                if (eventName === 'dragenter' || eventName === 'dragover') {
                    dropzone.classList.add('is-dragover');
                } else {
                    dropzone.classList.remove('is-dragover');
                }
            });
        });

        dropzone.addEventListener('drop', e => {
            inputImagenes.files = e.dataTransfer.files;
            mostrarPreviewImagenes(inputImagenes.files);
        });

        inputImagenes.addEventListener('change', () => {
            mostrarPreviewImagenes(inputImagenes.files);
        });

        function mostrarPreviewImagenes(files) {
            previewContainer.innerHTML = '';
            if (!files || files.length === 0) return;

            Array.from(files).forEach(file => {
                if (!file.type.startsWith('image/')) return;
                const reader = new FileReader();
                reader.onload = e => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-img';
                    img.style.height = '100px';
                    img.style.margin = '4px';
                    img.style.borderRadius = '8px';
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }

        if (btnCrear) {
            btnCrear.addEventListener('click', function (e) {
                errores = [];
                comprobarDatos('crear');
                if (errores.length === 0) {
                    e.preventDefault();
                    cargarDatos('/admin/mapa/SubirDatos');
                } else {
                    e.preventDefault();
                    mostrarErrores(errores);
                }
            });
        }

        if (btnEditar) {
            btnEditar.addEventListener('click', function (e) {
                errores = [];
                comprobarDatos('editar');
                if (errores.length === 0) {
                    e.preventDefault();
                    cargarDatos('/admin/mapa/subirEditar');
                } else {
                    e.preventDefault();
                    mostrarErrores(errores);
                }
            });
        }

        // El parámetro modo permite lógica diferente para crear/editar
        function comprobarDatos(modo) {
            if (!inputNombre.value.trim()) {
                errores.push('El nombre del evento es obligatorio');
            }
            if (!inputCiudad || !inputCiudad.value) {
                errores.push('Debes seleccionar una ciudad');
            }
            if (!inputDescripcion.value.trim()) {
                errores.push('La descripción es obligatoria');
            }
            if (!inputFecha.value) {
                errores.push('La fecha del evento es obligatoria');
            }

            if (modo === 'crear') {
                if (!inputImagenes.files || inputImagenes.files.length === 0) {
                    errores.push('Debes seleccionar al menos una imagen');
                }
            }
        }

        function cargarDatos(url) {
            const formData = new FormData();
            formData.append('nombre', inputNombre.value.trim());
            formData.append('ciudad', inputCiudad.value);
            formData.append('descripcion', inputDescripcion.value.trim());
            formData.append('fecha', inputFecha.value);
            formData.append('items', inputItems ? inputItems.value.trim() : '');

            if (url === '/admin/mapa/subirEditar') {
                const params = new URLSearchParams(window.location.search);
                const id = params.get('id');
                if (id) {
                    formData.append('id', id);
                }
            }

            if (inputImagenes.files && inputImagenes.files.length > 0) {
                Array.from(inputImagenes.files).forEach(file => {
                    formData.append('imagenes[]', file);
                });
            }

            // Mostrar loader con SweetAlert2
            Swal.fire({
                title: 'Cargando...',
                text: 'Por favor espera mientras se guarda el evento.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch(url, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    Swal.close();
                    if (data.ok) {
                        mostrarExito(data.message || 'El evento se guardó correctamente.');
                    } else {
                        mostrarErrores([data.message || 'Ocurrió un error al guardar el evento.']);
                    }
                })
                .catch(error => {
                    Swal.close();
                    mostrarErrores(['Error de red, intenta nuevamente.']);
                });
        }

    });
})();
