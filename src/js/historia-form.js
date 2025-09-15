// Manejo del formulario de crear historia
(function() {
    'use strict';

    // Elementos del formulario
    const form = document.getElementById('form-crear-historia');
    const botonSubmit = document.querySelector('.formulario-administrador__boton--guardar-historia');
    
    // Inputs del formulario
    const inputTitulo = document.getElementById('titulo');
    const inputAutor = document.getElementById('autor');
    const editorSinopsis = null; // Se obtendrá dinámicamente desde TinyMCE

    // Función para mostrar errores
    function mostrarErrores(errores) {
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

    // Función para validar el formulario
    function validarFormulario() {
        const errores = [];

        // Validar título
        if (!inputTitulo.value.trim()) {
            errores.push('El título es obligatorio.');
        } else if (inputTitulo.value.trim().length < 3) {
            errores.push('El título debe tener al menos 3 caracteres.');
        } else if (inputTitulo.value.trim().length > 200) {
            errores.push('El título no puede exceder 200 caracteres.');
        }

        // Validar autor
        if (!inputAutor.value.trim()) {
            errores.push('El autor es obligatorio.');
        } else if (inputAutor.value.trim().length < 2) {
            errores.push('El nombre del autor debe tener al menos 2 caracteres.');
        } else if (inputAutor.value.trim().length > 100) {
            errores.push('El nombre del autor no puede exceder 100 caracteres.');
        }

        // Validar sinopsis desde TinyMCE
        let contenidoSinopsis = '';
        const editor = tinymce.get('sinopsis');
        if (editor) {
            contenidoSinopsis = editor.getContent({format: 'text'});
        }

        if (!contenidoSinopsis.trim()) {
            errores.push('La sinopsis es obligatoria.');
        } else if (contenidoSinopsis.trim().length < 10) {
            errores.push('La sinopsis debe tener al menos 10 caracteres.');
        }

        return errores;
    }

    // Función para enviar datos
    function subirDatos() {
        const formData = new FormData();
        
        // Obtener contenido del editor TinyMCE
        const editor = tinymce.get('sinopsis');
        let contenidoSinopsis = '';
        if (editor) {
            contenidoSinopsis = editor.getContent();
        }

        // Agregar datos al FormData
        formData.append('titulo', inputTitulo.value.trim());
        formData.append('sinopsis', contenidoSinopsis);
        formData.append('autor', inputAutor.value.trim());

        // Mostrar loader
        Swal.fire({
            title: 'Guardando historia...',
            text: 'Por favor espera mientras se guarda la historia.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Enviar datos
        fetch('/admin/historyteling/crear/cargar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            Swal.close();
            
            if (data.ok) {
                // Éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Historia guardada!',
                    text: data.message || 'La historia se guardó correctamente.',
                    confirmButtonText: 'Continuar',
                    customClass: {
                        confirmButton: 'swal2-confirm btn-purple'
                    }
                }).then(() => {
                    // Redirigir a la lista de historias
                    window.location.href = data.redirect || '/admin/historyteling';
                });
            } else {
                // Error
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar',
                    text: data.message || 'Ocurrió un error al guardar la historia.',
                    confirmButtonText: 'Entendido',
                    customClass: {
                        confirmButton: 'swal2-confirm btn-purple'
                    }
                });
            }
        })
        .catch(error => {
            Swal.close();
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
                confirmButtonText: 'Entendido',
                customClass: {
                    confirmButton: 'swal2-confirm btn-purple'
                }
            });
        });
    }

    // Event listener para el botón de guardar
    if (botonSubmit && form) {
        botonSubmit.addEventListener('click', (e) => {
            e.preventDefault(); // Prevenir envío normal del formulario
            
            // Validar formulario
            const errores = validarFormulario();
            
            if (errores.length > 0) {
                mostrarErrores(errores);
            } else {
                subirDatos();
            }
        });
    }

    // Event listener para el formulario (en caso de envío con Enter)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar formulario
            const errores = validarFormulario();
            
            if (errores.length > 0) {
                mostrarErrores(errores);
            } else {
                subirDatos();
            }
        });
    }

    // Función para limpiar el formulario
    function limpiarFormulario() {
        if (inputTitulo) inputTitulo.value = '';
        if (inputAutor) inputAutor.value = '';
        
        const editor = tinymce.get('sinopsis');
        if (editor) {
            editor.setContent('');
        }
    }

    // Exponer funciones globalmente si es necesario
    window.HistoriaForm = {
        limpiar: limpiarFormulario,
        validar: validarFormulario,
        enviar: subirDatos
    };

    console.log('Historia Form JavaScript cargado correctamente');

})();

