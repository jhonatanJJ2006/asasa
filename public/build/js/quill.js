document.addEventListener('DOMContentLoaded', function () {
    const historiaBtn = document.querySelector('.formulario-administrador__boton--guardar-historia');
    const btnEditar = document.querySelector('.formulario-administrador__boton--editar-historia');
    const editorSinopsis = document.getElementById('editor-sinopsis');
    const sinopsisInput = document.querySelector('#sinopsis');

    if (editorSinopsis) {
        const quill = new Quill('#editor-sinopsis', {
            theme: 'snow',
            placeholder: 'Escribe la sinopsis aquí...',
            modules: {
                toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['link', 'blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['clean']
                ]
            }
        });

        if (sinopsisInput && sinopsisInput.value) {
            quill.root.innerHTML = sinopsisInput.value;
        }

        // Mostrar errores con estilo
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

        // Mostrar éxito
        const mostrarExito = (mensaje, redirect) => {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: mensaje,
                confirmButtonText: 'Continuar',
                customClass: {
                    confirmButton: 'swal2-confirm btn-purple'
                }
            }).then(() => {
                window.location.href = redirect;
            });
        };

        // CREAR HISTORIA
        if (historiaBtn) {
            historiaBtn.addEventListener('click', function (e) {
                e.preventDefault();

                const titulo = document.getElementById('titulo')?.value.trim();
                const autor = document.getElementById('autor')?.value.trim();
                const sinopsis = quill.root.innerHTML.trim();

                const errores = [];
                if (!titulo) errores.push('El título es obligatorio.');
                if (!autor) errores.push('El autor es obligatorio.');
                if (!sinopsis || sinopsis === '<p><br></p>') errores.push('La sinopsis no puede estar vacía.');

                if (errores.length > 0) {
                    mostrarErrores(errores);
                    return;
                }

                const formData = new FormData();
                formData.append('titulo', titulo);
                formData.append('sinopsis', sinopsis);
                formData.append('autor', autor);

                fetch('/admin/historyteling/crear/cargar', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(result => {
                        if (result.ok) {
                            mostrarExito(result.message || 'Historia guardada correctamente', `/admin/historyteling`);
                        } else {
                            mostrarErrores([result.message || 'Error al guardar la historia']);
                        }
                    })
                    .catch(err => {
                        console.error('Error al guardar historia:', err);
                        mostrarErrores(['Ocurrió un error inesperado al guardar la historia.']);
                    });
            });
        }

        // EDITAR HISTORIA
        if (btnEditar) {
            btnEditar.addEventListener('click', () => {
                const titulo = document.getElementById('titulo')?.value.trim();
                const autor = document.getElementById('autor')?.value.trim();
                const sinopsis = quill.root.innerHTML.trim();

                const errores = [];
                if (!titulo) errores.push('El título es obligatorio.');
                if (!autor) errores.push('El autor es obligatorio.');
                if (!sinopsis || sinopsis === '<p><br></p>') errores.push('La sinopsis no puede estar vacía.');

                if (errores.length > 0) {
                    mostrarErrores(errores);
                    return;
                }

                const params = new URLSearchParams(window.location.search);
                const id = params.get('id');

                const formData = new FormData();
                formData.append('titulo', titulo);
                formData.append('sinopsis', sinopsis);
                formData.append('autor', autor);
                formData.append('id', id);

                fetch('/admin/historyteling/editar/cargar', {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(result => {
                        if (result.ok) {
                            mostrarExito(result.message || 'Historia editada correctamente', `/admin/historyteling`);
                        } else {
                            mostrarErrores([result.message || 'Error al editar la historia']);
                        }
                    })
                    .catch(err => {
                        console.error('Error al editar historia:', err);
                        mostrarErrores(['Ocurrió un error inesperado al editar la historia.']);
                    });
            });
        }
    }
});
