/**
 * Módulo para manejar el formulario de About
 * Incluye subida de imágenes, preview, eliminación y envío del formulario
 */

class AboutFormManager {
    constructor() {
        this.dropzone = document.getElementById('dropzone-img');
        this.fileInput = document.getElementById('imagenes');
        this.previewContainer = document.getElementById('imagenes-preview');
        this.form = document.getElementById('formAboutEditar');
        this.imagenesExistentes = document.getElementById('imagenes-existentes');
        
        this.init();
    }

    init() {
        this.setupDropzone();
        this.setupFileInput();
        this.setupFormSubmit();
        this.setupImageDeletion();
    }

    setupDropzone() {
        if (!this.dropzone) return;

        // Click para abrir selector de archivos
        this.dropzone.addEventListener('click', () => {
            this.fileInput.click();
        });

        // Drag and drop
        this.dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropzone.classList.add('dragover');
        });

        this.dropzone.addEventListener('dragleave', () => {
            this.dropzone.classList.remove('dragover');
        });

        this.dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropzone.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });
    }

    setupFileInput() {
        if (!this.fileInput) return;

        this.fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
    }

    handleFiles(files) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showAlert('Por favor selecciona solo archivos de imagen', 'error');
            return;
        }

        // Validar tamaño (5MB máximo)
        const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            this.showAlert('Algunas imágenes son demasiado grandes (máximo 5MB)', 'error');
            return;
        }

        imageFiles.forEach(file => {
            this.createPreview(file);
        });
    }

    createPreview(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <div class="preview-info">
                    <span class="preview-name">${file.name}</span>
                    <span class="preview-size">${this.formatFileSize(file.size)}</span>
                </div>
                <button type="button" class="btn-remove-preview">
                    <i class="fa-solid fa-times"></i>
                </button>
            `;

            // Botón para eliminar preview
            const removeBtn = previewItem.querySelector('.btn-remove-preview');
            removeBtn.addEventListener('click', () => {
                previewItem.remove();
            });

            this.previewContainer.appendChild(previewItem);
        };

        reader.readAsDataURL(file);
    }

    setupImageDeletion() {
        if (!this.imagenesExistentes) return;

        this.imagenesExistentes.addEventListener('click', (e) => {
            if (e.target.closest('.btn-eliminar-imagen')) {
                const button = e.target.closest('.btn-eliminar-imagen');
                const imagenNombre = button.dataset.imagen;
                
                if (confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
                    this.eliminarImagen(imagenNombre, button);
                }
            }
        });
    }

    async eliminarImagen(imagenNombre, buttonElement) {
        try {
            const response = await fetch('/admin/about/eliminar-imagen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imagen: imagenNombre,
                    id: document.querySelector('input[name="id"]').value
                })
            });

            const result = await response.json();

            if (result.success) {
                // Eliminar del DOM
                const imagenItem = buttonElement.closest('.imagen-item');
                imagenItem.remove();
                this.showAlert('Imagen eliminada correctamente', 'success');
            } else {
                this.showAlert('Error al eliminar la imagen: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('Error al eliminar la imagen', 'error');
        }
    }

    setupFormSubmit() {
        if (!this.form) return;

        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Deshabilitar botón y mostrar loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Actualizando...';

            try {
                const formData = new FormData(this.form);
                
                const response = await fetch('/admin/about/actualizar', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    this.showAlert(result.message, 'success');
                    // Recargar la página después de 2 segundos
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    this.showAlert(result.message || 'Error al actualizar', 'error');
                    if (result.errores) {
                        console.error('Errores:', result.errores);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                this.showAlert('Error de conexión', 'error');
            } finally {
                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showAlert(message, type = 'info') {
        // Crear o actualizar alerta
        let alert = document.querySelector('.alert');
        if (!alert) {
            alert = document.createElement('div');
            alert.className = 'alert';
            document.body.appendChild(alert);
        }

        alert.className = `alert alert--${type}`;
        alert.innerHTML = `
            <div class="alert__content">
                <i class="fa-solid fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="alert__close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (alert && alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AboutFormManager();
});
