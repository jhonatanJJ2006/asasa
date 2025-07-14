(function () {

    // Selección de campos
    const dropzone = document.getElementById('dropzone-img');
    const inputImage = document.getElementById('imagen');
    const imagenPreview = document.querySelector('.preview');

    const inputFecha = document.getElementById('fecha');
    const inputTitulo = document.getElementById('titulo');
    const inputDescripcion = document.getElementById('descripcion');
    const inputPDFs = document.getElementById('pdfs');
    const form = document.querySelector('.formulario-administrador');
    const submitBtn = document.querySelector('.formulario-administrador__boton--logro');

    // Vista previa de imagen
    if (dropzone) {
        dropzone.addEventListener('click', () => {
            inputImage.click();
        });

        // Drag and drop support
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, e => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        dropzone.addEventListener('drop', e => {
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                inputImage.files = e.dataTransfer.files;
                mostrarPreviewImagen(inputImage.files[0]);
            }
        });

        inputImage.addEventListener('change', () => {
            if (inputImage.files.length) {
                mostrarPreviewImagen(inputImage.files[0]);
            }
        });

        function mostrarPreviewImagen(file) {
            if (!file) return;
            const permitidas = ['image/jpeg', 'image/png', 'image/webp'];
            if (!permitidas.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Formato no permitido',
                    text: 'Solo se permiten imágenes JPEG, PNG o WEBP',
                });
                return;
            }
            const reader = new FileReader();
            reader.onload = e => {
                imagenPreview.src = e.target.result;
                imagenPreview.style.height = 'auto';
                imagenPreview.style.maxHeight = '350px';
                imagenPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    // Vista previa de PDFs (simple: muestra nombres)
    if (inputPDFs) {
        inputPDFs.addEventListener('change', () => {
            let prev = document.querySelector('.pdf-preview-list');
            if (prev) prev.remove();
            if (inputPDFs.files.length > 0) {
                let ul = document.createElement('ul');
                ul.className = "pdf-preview-list";
                Array.from(inputPDFs.files).forEach(file => {
                    let li = document.createElement('li');
                    li.textContent = file.name;
                    ul.appendChild(li);
                });
                inputPDFs.parentNode.appendChild(ul);
            }
        });
    }

    // SUBMIT/REGISTRO
    if (submitBtn && form) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();

            let errores = [];

            // Validación
            if (!inputFecha.value) errores.push('La fecha es obligatoria');
            if (!inputTitulo.value.trim()) errores.push('El título es obligatorio');
            if (!inputDescripcion.value.trim()) errores.push('La descripción es obligatoria');
            if (inputDescripcion.value.trim().length < 10)
                errores.push('La descripción debe tener al menos 10 caracteres');

            // Validación opcional de imagen
            if (inputImage && inputImage.files.length > 0) {
                let file = inputImage.files[0];
                const permitidas = ['image/jpeg', 'image/png', 'image/webp'];
                if (!permitidas.includes(file.type)) {
                    errores.push('La imagen debe ser JPEG, PNG o WEBP');
                }
            }

            // Validación opcional de PDFs
            if (inputPDFs && inputPDFs.files.length > 0) {
                Array.from(inputPDFs.files).forEach(file => {
                    if (file.type !== "application/pdf") {
                        errores.push('Solo se permiten archivos PDF');
                    }
                });
            }

            if (errores.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Corrige estos errores',
                    html: '<ul style="text-align:left;">' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // Armar FormData
            const formData = new FormData();
            formData.append('fecha', inputFecha.value);
            formData.append('titulo', inputTitulo.value.trim());
            formData.append('descripcion', inputDescripcion.value.trim());

            if (inputImage && inputImage.files.length > 0) {
                formData.append('imagen', inputImage.files[0]);
            }

            // Agregar los PDFs
            if (inputPDFs && inputPDFs.files.length > 0) {
                Array.from(inputPDFs.files).forEach((file, i) => {
                    formData.append('pdfs[]', file);
                });
            }

            // ENVÍO AJAX
            fetch('/admin/logros/crear/subirLogro', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logro registrado correctamente',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        window.location.href = '/admin/logros';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ocurrió un error al guardar el logro.',
                        text: 'Intenta nuevamente.'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error de red.',
                    text: 'Verifica tu conexión e intenta otra vez.'
                });
            });
        });
    }

})();
