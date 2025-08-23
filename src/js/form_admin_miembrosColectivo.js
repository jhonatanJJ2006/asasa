(function () {

    // Imagen
    const dropzone = document.querySelector('.formulario-administrador__dropzone');
    const inputImage = document.getElementById('imagen');
    const imagenPreview = document.querySelector('.preview');

    // Datos
    const nombreMiembro = document.getElementById('nombre');
    const descripcionMiembro = document.getElementById('descripcion');
    const adicional = document.querySelector('#tagsHidden');

    // Redes
    let redesDB = [];
    const redes = document.querySelectorAll('.formulario-administrador__input--sociales');

    // Botones
    const btnForm = document.querySelector('.formulario-administrador__boton--miembroColectivo');
    const btnFormEditar = document.querySelector('.formulario-administrador__boton--miembroColectivo-editar');

    // Errores
    let errores = [];

    // Función SweetAlert2 para mostrar errores
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

    if (dropzone) {

        dropzone.addEventListener('click', () => {
            inputImage.click();
        });

        inputImage.addEventListener('change', () => {

            if (inputImage.files.length) {
                handleFile(inputImage.files[0]);
            }

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, e => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });

        });

        function handleFile(file) {
            const permitidas = ['image/jpeg', 'image/png'];
            if (permitidas.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = e => {
                    imagenPreview.style.height = '40rem';
                    imagenPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                mostrarErrores(['Solo se permiten imágenes JPEG o PNG']);
            }
        }

    }

    if (btnForm) {

        btnForm.addEventListener('click', (e) => {

            errores = [];

            comprobarDatos();

            if (errores.length === 0) {
                subirDatos();
            } else {
                e.preventDefault();
                mostrarErrores(errores);
            }

        });

        function comprobarDatos() {

            if (nombreMiembro.value.trim() === '') {
                errores.push('El nombre del miembro del colectivo es obligatorio');
            }
            if (descripcionMiembro.value.trim() === '') {
                errores.push('La descripción del miembro del colectivo es obligatoria');
            }
            if (descripcionMiembro.value.trim().length < 30) {
                errores.push('La descripción del miembro del colectivo debe contener al menos 30 caracteres');
            }
            if (!inputImage.files || !inputImage.files[0]) {
                errores.push('La imagen del miembro del colectivo es obligatoria');
            }

            redesDB = [];

            redes.forEach(red => {
                if (red.value !== '') {
                    let datoRed = red.value;
                    let idRed = red.getAttribute('data-red');
                    redesDB.push({
                        id: idRed,
                        valor: datoRed
                    });
                }
            });

        }

        function subirDatos() {

            const formData = new FormData();
            formData.append('nombre', nombreMiembro.value.trim());
            formData.append('descripcion', descripcionMiembro.value.trim());
            formData.append('imagen', inputImage.files[0]);

            if (adicional && adicional.value !== '') {
                formData.append('tags', adicional.value.trim());
            }

            if (redesDB.length !== 0) {
                formData.append('redes', JSON.stringify(redesDB));
            }

            Swal.fire({
                title: 'Cargando...',
                text: 'Por favor espera mientras se guarda el miembro.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch('/admin/miembrosColectivo/crear/subirMiembro', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    Swal.close(); // Cierra el loader al completar
                    location.href = '/admin/miembrosColectivo';
                })
                .catch(error => {
                    Swal.close(); // Asegúrate de cerrarlo si hay error
                    mostrarErrores(['Error de red, intenta nuevamente.']);
                });


        }

    }

    if (btnFormEditar) {

        btnFormEditar.addEventListener('click', (e) => {

            errores = [];

            comprobarDatos();

            if (errores.length === 0) {
                subirDatos();
            } else {
                e.preventDefault();
                mostrarErrores(errores);
            }

        });


        function comprobarDatos() {

            if (nombreMiembro.value.trim() === '') {
                errores.push('El nombre del miembro del colectivo es obligatorio');
            }
            if (descripcionMiembro.value.trim() === '') {
                errores.push('La descripción del miembro del colectivo es obligatoria');
            }
            if (descripcionMiembro.value.trim().length < 30) {
                errores.push('La descripción del miembro del colectivo debe contener al menos 30 caracteres');
            }

            redesDB = [];

            redes.forEach(red => {
                if (red.value !== '') {
                    let datoRed = red.value;
                    let idRed = red.getAttribute('data-red');
                    redesDB.push({
                        id: idRed,
                        valor: datoRed
                    });
                }
            });

        }

        function subirDatos() {

            const formData = new FormData();
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            formData.append('id', id);
            formData.append('nombre', nombreMiembro.value.trim());
            formData.append('descripcion', descripcionMiembro.value.trim());

            if (inputImage.files[0]) {
                formData.append('imagen', inputImage.files[0]);
            }

            if (adicional && adicional.value !== '') {
                formData.append('tags', adicional.value.trim());
            }

            if (redesDB.length !== 0) {
                formData.append('redes', JSON.stringify(redesDB));
            }

            Swal.fire({
                title: 'Cargando...',
                text: 'Por favor espera mientras se guarda el miembro.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch('/admin/miembrosColectivo/editarMiembro', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    Swal.close(); // Cierra el loader
                    location.href = '/admin/miembrosColectivo';
                })
                .catch(error => {
                    Swal.close(); // También ciérralo si hay error
                    mostrarErrores(['Error de red, intenta nuevamente.']);
                });


        }

    }

})();
