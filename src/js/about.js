(function () {

    // Elementos
    const dropzone = document.querySelector('.formulario-administrador__dropzone');
    const inputImagenes = document.getElementById('imagenes');
    const previewImagenes = document.getElementById('imagenes-preview');
    const inputFrase = document.getElementById('frase');
    const inputDescripcion = document.getElementById('descripcion');
    const inputNumero = document.getElementById('numero');
    const inputEmail = document.getElementById('email');
    const inputCV = document.getElementById('cv');
    const botonSubmit = document.querySelector('.formulario-administrador__boton--mapa-crear');

    let errores = [];

    // Mostrar errores con SweetAlert
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

    // Función para subir datos
    function subirDatos() {
        const formData = new FormData();

        // Imágenes (pueden ser varias)
        for (let i = 0; i < inputImagenes.files.length; i++) {
            formData.append('imagenes[]', inputImagenes.files[i]);
        }

        formData.append('frase', inputFrase.value.trim());
        formData.append('descripcion', inputDescripcion.value.trim());
        formData.append('numero', inputNumero.value.trim());
        formData.append('email', inputEmail.value.trim());
        formData.append('cv', inputCV.files[0]);

        Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera mientras se guarda la información.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        fetch('/admin/about/guardar', {  // Ajusta esta URL según tu endpoint real
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                Swal.close();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Guardado',
                        text: 'La información se guardó correctamente.'
                    }).then(() => {
                        location.href = '/admin/about';
                    });
                } else {
                    mostrarErrores([data.message || 'Error al guardar.']);
                }
            })
            .catch(() => {
                Swal.close();
                mostrarErrores(['Error de red, intenta nuevamente.']);
            });
    }

    // Validación y envío
    if (botonSubmit) {
        botonSubmit.addEventListener('click', (e) => {
            errores = [];

            if (!inputImagenes.files || inputImagenes.files.length === 0) {
                errores.push('Debe subir al menos una imagen.');
            }

            if (!inputFrase.value.trim()) errores.push('La frase es obligatoria.');
            if (!inputNumero.value.trim()) errores.push('El número es obligatorio.');
            if (!inputEmail.value.trim()) errores.push('El email es obligatorio.');

            if (!inputCV.files[0]) {
                errores.push('El archivo de CV es obligatorio.');
            } else if (inputCV.files[0].type !== 'application/pdf') {
                errores.push('El CV debe ser un archivo PDF.');
            }

            if (errores.length) {
                e.preventDefault();
                mostrarErrores(errores);
            } else {
                e.preventDefault(); // Evitar el envío normal
                subirDatos();
            }
        });
    }

})();
