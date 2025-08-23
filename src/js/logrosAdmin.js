(function () {

    const form = document.querySelector('.formulario-administrador');
    const submitBtn = document.querySelector('.formulario-administrador__boton--logro-editar');
    const btnsEliminar = document.querySelectorAll('.table__formulario--eliminar-logro');
    const btnAñadirDestacado = document.querySelectorAll(".table__formulario--añadir-destacados");
    const btnQuitarDestacado = document.querySelectorAll(".table__formulario--quitar-destacados");

    if (submitBtn) {

        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const inputFecha = document.getElementById('fecha');
            const inputTitulo = document.getElementById('titulo');
            const inputDescripcion = document.getElementById('descripcion');
            const inputImage = document.getElementById('imagen');
            const inputPDFs = document.getElementById('pdfs');

            let errores = [];

            // Validaciones mínimas
            if (!inputFecha.value) errores.push('La fecha es obligatoria');
            if (!inputTitulo.value.trim()) errores.push('El título es obligatorio');
            if (!inputDescripcion.value.trim()) errores.push('La descripción es obligatoria');

            if (errores.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Errores en el formulario',
                    html: '<ul style="text-align:left;">' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>',
                    confirmButtonText: 'Corregir'
                });
                return;
            }

            // Loader mientras sube
            Swal.fire({
                title: 'Guardando...',
                text: 'Por favor espera mientras se guarda el logro.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Armar FormData
            const formData = new FormData();
            formData.append('fecha', inputFecha.value);
            formData.append('titulo', inputTitulo.value.trim());
            formData.append('descripcion', inputDescripcion.value.trim());
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            if (id) {
                formData.append('id', id);
            }

            if (inputImage && inputImage.files.length > 0) {
                formData.append('imagen', inputImage.files[0]);
            }

            if (inputPDFs && inputPDFs.files.length > 0) {
                Array.from(inputPDFs.files).forEach(file => {
                    formData.append('pdfs[]', file);
                });
            }

            // Enviar datos con fetch
            fetch('/admin/logros/editar/subirLogro', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    Swal.close(); // Quitar loader
                    if (data === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Logro editado correctamente',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            window.location.href = '/admin/logros';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ocurrió un error',
                            text: 'No se pudo guardar el logro. Intenta nuevamente.'
                        });
                    }
                })
                .catch(error => {
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'Verifica tu conexión o contacta soporte.'
                    });
                });
        });

    }

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

                        Swal.fire({
                            title: 'Eliminando...',
                            text: 'El logro se está eliminando.',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        fetch('/admin/logros/eliminar', {
                            method: 'POST',
                            body: data
                        })
                            .then(res => res.json())
                            .then(response => {
                                Swal.close();
                                if (response.ok) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Logro eliminado correctamente',
                                        confirmButtonText: 'Aceptar'
                                    }).then(() => {
                                        window.location.href = '/admin/logros';
                                    });
                                } else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error al eliminar',
                                        text: response.message || 'No se pudo eliminar el logro.'
                                    });
                                }
                            })
                            .catch(error => {
                                Swal.close();
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
    
    if(btnAñadirDestacado.length > 0) {
        btnAñadirDestacado.forEach(btn => {

            btn.addEventListener("click", () => {

                const id = btn.dataset.id;

                if(!id) return;

                Swal.fire({
                    icon: "warning",
                    title: "¿Estás seguro?",
                    showCancelButton: true,
                    confirmButtonText: "Aceptar"
                }).then(result => {
                    if(result.isConfirmed) {
                        const data = new FormData();
                        data.append("id", id);

                        Swal.fire({
                            title: "Añadiendo a destacados...",
                            text: "El logro se está añadiendo a destacados.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        
                        fetch("/admin/logros/crear-destacado", {
                            method: "POST",
                            body: data
                        })
                        .then(res => res.json())
                        .then(response => {
                            Swal.close();
                            if(response) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Logro añadido a destacados correctamente",
                                    confirmButtonText: "Aceptar"
                                })
                                .then(() => {
                                    window.location.reload();
                                })
                            }
                        })
                        .catch(error => {
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                title: "Error al añadir el logro a destacados",
                                text: error.message
                            })
                        })
                    }
                });

            })

        });
    }

    if(btnQuitarDestacado.length > 0) {

        btnQuitarDestacado.forEach(btn => {

            btn.addEventListener("click", () => {

                const id = btn.dataset.id;

                if(!id) return;

                Swal.fire({
                    icon: "warning",
                    title: "¿Estás seguro?",
                    showCancelButton: true,
                    confirmButtonText: "Aceptar"
                }).then(result => {
                    if(result.isConfirmed) {
                        const data = new FormData();
                        data.append("id", id);

                        Swal.fire({
                            title: "Eliminando de destacados...",
                            text: "El logro se eliminó de destacados.",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        
                        fetch("/admin/logros/eliminar-destacado", {
                            method: "POST",
                            body: data
                        })
                        .then(res => res.json())
                        .then(response => {
                            Swal.close();
                            if(response) {
                                Swal.fire({
                                    icon: "success",
                                    title: "Logro eliminado de destacados correctamente",
                                    confirmButtonText: "Aceptar"
                                })
                                .then(() => {
                                    window.location.reload();
                                })
                            }
                        })
                        .catch(error => {
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                title: "Error al eliminar el logro de destacados",
                                text: error.message
                            })
                        })
                    }
                });

            });

        })

    }

})();
