/**
 * Módulo para manejar el formulario de edición de historias
 * Incluye validación, envío con SweetAlert y manejo de TinyMCE
 */

class HistoriaFormManager {
    constructor() {
        this.form = document.getElementById('form-editar-historia');
        this.submitBtn = document.getElementById('btn-editar-historia');
        this.tituloInput = document.getElementById('titulo');
        this.autorInput = document.getElementById('autor');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormSubmit();
            this.setupValidation();
        }
    }

    setupFormSubmit() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulario enviado, iniciando validación...');
            
            // Validar formulario antes de enviar
            if (!this.validateForm()) {
                console.log('Validación falló');
                return;
            }
            
            console.log('Validación exitosa, enviando datos...');

            // Mostrar loader con SweetAlert
            Swal.fire({
                title: 'Actualizando historia...',
                text: 'Por favor espera mientras se procesa tu historia',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Deshabilitar botón
            this.submitBtn.disabled = true;
            const originalContent = this.submitBtn.innerHTML;
            this.submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Actualizando...';

            try {
                // Obtener contenido del editor TinyMCE
                const sinopsisContent = this.getSinopsisContent();
                console.log('Contenido de sinopsis:', sinopsisContent.substring(0, 100) + '...');
                
                // Crear FormData
                const formData = new FormData();
                formData.append('id', this.form.querySelector('input[name="id"]').value);
                formData.append('titulo', this.tituloInput.value.trim());
                formData.append('sinopsis', sinopsisContent);
                formData.append('autor', this.autorInput.value.trim());
                
                console.log('Datos a enviar:', {
                    id: this.form.querySelector('input[name="id"]').value,
                    titulo: this.tituloInput.value.trim(),
                    autor: this.autorInput.value.trim(),
                    sinopsisLength: sinopsisContent.length
                });

                // Enviar petición
                const response = await fetch('/admin/historyteling/editar/cargar', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.ok) {
                    // Éxito
                    Swal.fire({
                        title: '¡Historia actualizada!',
                        text: result.message || 'La historia se ha actualizado correctamente',
                        icon: 'success',
                        confirmButtonText: 'Continuar',
                        timer: 3000,
                        timerProgressBar: true
                    }).then(() => {
                        // Redirigir a la lista de historias
                        window.location.href = '/admin/historyteling';
                    });
                } else {
                    // Error
                    Swal.fire({
                        title: 'Error al actualizar',
                        text: result.message || 'Hubo un problema al actualizar la historia',
                        icon: 'error',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    title: 'Error de conexión',
                    text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            } finally {
                // Restaurar botón
                this.submitBtn.disabled = false;
                this.submitBtn.innerHTML = originalContent;
            }
        });
    }

    setupValidation() {
        // Validación en tiempo real
        this.tituloInput.addEventListener('blur', () => {
            this.validateTitulo();
        });

        this.autorInput.addEventListener('blur', () => {
            this.validateAutor();
        });
    }

    validateForm() {
        let isValid = true;

        // Validar título
        if (!this.validateTitulo()) {
            isValid = false;
        }

        // Validar autor
        if (!this.validateAutor()) {
            isValid = false;
        }

        // Validar sinopsis
        if (!this.validateSinopsis()) {
            isValid = false;
        }

        return isValid;
    }

    validateTitulo() {
        const titulo = this.tituloInput.value.trim();
        
        if (!titulo) {
            this.showFieldError(this.tituloInput, 'El título es obligatorio');
            return false;
        }

        if (titulo.length < 3) {
            this.showFieldError(this.tituloInput, 'El título debe tener al menos 3 caracteres');
            return false;
        }

        if (titulo.length > 100) {
            this.showFieldError(this.tituloInput, 'El título no puede exceder 100 caracteres');
            return false;
        }

        this.clearFieldError(this.tituloInput);
        return true;
    }

    validateAutor() {
        const autor = this.autorInput.value.trim();
        
        if (!autor) {
            this.showFieldError(this.autorInput, 'El autor es obligatorio');
            return false;
        }

        if (autor.length < 2) {
            this.showFieldError(this.autorInput, 'El autor debe tener al menos 2 caracteres');
            return false;
        }

        if (autor.length > 50) {
            this.showFieldError(this.autorInput, 'El autor no puede exceder 50 caracteres');
            return false;
        }

        this.clearFieldError(this.autorInput);
        return true;
    }

    validateSinopsis() {
        const sinopsis = this.getSinopsisContent();
        
        if (!sinopsis || sinopsis.trim() === '') {
            Swal.fire({
                title: 'Sinopsis requerida',
                text: 'La sinopsis es obligatoria',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return false;
        }

        // Contar caracteres (sin HTML)
        const textContent = sinopsis.replace(/<[^>]*>/g, '').trim();
        
        if (textContent.length < 100) {
            Swal.fire({
                title: 'Sinopsis muy corta',
                text: 'La sinopsis debe tener al menos 100 caracteres',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return false;
        }

        if (textContent.length > 1000) {
            Swal.fire({
                title: 'Sinopsis muy larga',
                text: 'La sinopsis no puede exceder 1000 caracteres',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return false;
        }

        return true;
    }

    getSinopsisContent() {
        // Intentar obtener contenido del editor TinyMCE
        if (typeof tinymce !== 'undefined' && tinymce.get('sinopsis')) {
            return tinymce.get('sinopsis').getContent();
        }
        
        // Fallback al textarea
        return document.getElementById('sinopsis').value;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HistoriaFormManager();
});