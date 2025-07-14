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

    // Boton
    const btnForm = document.querySelector('.formulario-administrador__boton--miembroColectivo');

    // Errores
    let errores = [];

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
                alert('Solo se permiten imagenes jpeg o png');
            }

        }

    }

    if (btnForm) {

        btnForm.addEventListener('click', () => {

            errores = [];

            comprobarDatos();

            if (errores.length === 0) {

                subirDatos();

            } else {
                console.log(errores);
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
                errores.push('La descripción del miembro del colectivo debe contener almenos 30 caracteres');
            }
            if (!inputImage.files || !inputImage.files[0]) {
                errores.push('La imagen del miembro del colectivo es obligatoria');
            }

            redesDB = [];

            redes.forEach(red => {

                if(red.value !== '') {
                    let datoRed = red.value;
                    let idRed = red.getAttribute('data-red');
    
                    redesDB.push({
                        id : idRed,
                        valor : datoRed
                    });
                }

            });

        }

        function subirDatos() {

            const formData = new FormData();
            formData.append('nombre', nombreMiembro.value.trim());
            formData.append('descripcion', descripcionMiembro.value.trim());
            formData.append('imagen', inputImage.files[0]);

            if(adicional.value !== '') {
                formData.append('tags', adicional.value.trim());
            }

            if(redesDB.length !== 0) {
                formData.append('redes', JSON.stringify(redesDB));
            }

            fetch('/admin/miembrosColectivo/crear/subirMiembro', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if(data) {
                        location.href = '/admin/miembrosColectivo';
                    } else {
                        console.log('todo mal');
                    }

                })
                .catch(error => {
                    console.log('error');
                });

        }

    }

})();