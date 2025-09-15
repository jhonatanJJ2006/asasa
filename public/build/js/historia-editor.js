document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('sinopsis-editor');
    const hiddenTextarea = document.getElementById('sinopsis');
    const previewContainer = document.getElementById('sinopsis-preview');
    const previewContent = previewContainer?.querySelector('.preview-content');
    const previewToggle = document.getElementById('preview-toggle-historia');
    const charCount = document.querySelector('.char-count-historia');
    const wordCount = document.querySelector('.word-count-historia');

    if (!editor) return;

    let isPreviewMode = false;
    let uploadedImages = [];

    // Función para actualizar contadores
    function updateStats() {
        const text = editor.textContent || editor.innerText || '';
        const chars = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        if (charCount) charCount.textContent = `${chars} caracteres`;
        if (wordCount) wordCount.textContent = `${words} palabras`;
        
        if (charCount) {
            if (chars < 100) {
                charCount.style.color = '#ef4444';
            } else if (chars <= 2000) {
                charCount.style.color = '#22c55e';
            } else {
                charCount.style.color = '#f59e0b';
            }
        }
    }

    // Función para sincronizar con textarea oculta
    function syncWithTextarea() {
        if (hiddenTextarea) {
            hiddenTextarea.value = editor.innerHTML;
        }
        updateStats();
    }

    // Configurar placeholder
    function updatePlaceholder() {
        if (editor.textContent.trim() === '') {
            editor.classList.add('empty');
        } else {
            editor.classList.remove('empty');
        }
    }

    // Event listeners del editor
    editor.addEventListener('input', function() {
        syncWithTextarea();
        updatePlaceholder();
    });

    editor.addEventListener('paste', function(e) {
        const items = Array.from(e.clipboardData.items);
        
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = item.getAsFile();
                if (file) {
                    uploadImageToServer(file);
                }
                return;
            }
        }
        
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    // Botones de formato
    document.querySelectorAll('.editor-btn[data-command]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const command = this.getAttribute('data-command');
            document.execCommand(command, false, null);
            editor.focus();
            syncWithTextarea();
        });
    });

    // Insertar enlace
    const linkBtn = document.getElementById('insert-link-historia');
    if (linkBtn) {
        linkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLinkModal();
        });
    }

    // Insertar imagen
    const imageBtn = document.getElementById('insert-image-historia');
    if (imageBtn) {
        imageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showImageModal();
        });
    }

    // Toggle preview
    if (previewToggle) {
        previewToggle.addEventListener('click', function(e) {
            e.preventDefault();
            togglePreview();
        });
    }

    // Modal para enlaces
    function showLinkModal() {
        const url = prompt('Ingresa la URL del enlace:');
        if (url) {
            const text = window.getSelection().toString() || prompt('Texto del enlace:') || url;
            const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="editor-link">${text}</a>`;
            document.execCommand('insertHTML', false, linkHtml);
            
            setTimeout(() => {
                previewLink(url);
            }, 100);
            
            syncWithTextarea();
        }
    }

    // Modal para imágenes
    function showImageModal() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                uploadImageToServer(file);
            }
        });
        
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    // Función para subir imagen al servidor
    async function uploadImageToServer(file) {
        try {
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'image-upload-loading';
            loadingIndicator.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Subiendo imagen...</span>
                </div>
            `;
            
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.insertNode(loadingIndicator);
            } else {
                editor.appendChild(loadingIndicator);
            }

            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/admin/upload-image', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const pictureHtml = `
                    <picture class="editor-image-container">
                        <source srcset="${result.data.url_webp}" type="image/webp">
                        <img src="${result.data.url_png}" 
                             alt="Imagen insertada" 
                             class="editor-image" 
                             data-filename="${result.data.filename}">
                    </picture>
                `;

                loadingIndicator.outerHTML = pictureHtml;

                uploadedImages.push({
                    filename: result.data.filename,
                    url_png: result.data.url_png,
                    url_webp: result.data.url_webp
                });

                showNotification('Imagen subida correctamente', 'success');
            } else {
                throw new Error(result.message || 'Error al subir imagen');
            }

        } catch (error) {
            console.error('Error al subir imagen:', error);
            
            const loadingIndicator = document.querySelector('.image-upload-loading');
            if (loadingIndicator && loadingIndicator.parentNode) {
                loadingIndicator.remove();
            }
            
            showNotification(`Error: ${error.message}`, 'error');
        }

        syncWithTextarea();
    }

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `editor-notification editor-notification--${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Previsualización de enlaces estilo WhatsApp/Telegram
    async function previewLink(url) {
        try {
            const linkPreview = document.createElement('div');
            linkPreview.className = 'link-preview';
            linkPreview.innerHTML = `
                <div class="link-preview__loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Cargando previsualización...</span>
                </div>
            `;

            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.collapse(false);
                range.insertNode(linkPreview);
            }

            setTimeout(() => {
                const domain = new URL(url).hostname;
                const siteName = domain.replace('www.', '').toUpperCase();
                
                let title = `Contenido de ${domain}`;
                let description = 'Enlace externo compartido en el editor.';
                
                if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
                    title = 'Video de YouTube';
                    description = 'Mira este video en YouTube';
                } else if (domain.includes('github.com')) {
                    title = 'Repositorio de GitHub';
                    description = 'Proyecto de código abierto';
                } else if (domain.includes('twitter.com') || domain.includes('x.com')) {
                    title = 'Post de Twitter/X';
                    description = 'Publicación en redes sociales';
                } else if (domain.includes('instagram.com')) {
                    title = 'Post de Instagram';
                    description = 'Contenido visual en Instagram';
                } else if (domain.includes('linkedin.com')) {
                    title = 'Contenido de LinkedIn';
                    description = 'Publicación profesional';
                }

                linkPreview.innerHTML = `
                    <div class="link-preview__card" onclick="window.open('${url}', '_blank')">
                        <div class="link-preview__thumbnail link-preview__thumbnail--placeholder"></div>
                        <div class="link-preview__content">
                            <div class="link-preview__site-info">
                                <div class="link-preview__favicon">
                                    <img src="https://www.google.com/s2/favicons?domain=${domain}" 
                                         alt="Favicon" 
                                         onerror="this.style.display='none'">
                                </div>
                                <div class="link-preview__site-name">${siteName}</div>
                            </div>
                            <div class="link-preview__title">${title}</div>
                            <div class="link-preview__description">${description}</div>
                            <div class="link-preview__url">${url}</div>
                        </div>
                        <button class="link-preview__remove" onclick="event.stopPropagation(); this.parentElement.parentElement.remove(); if(window.syncWithTextarea) window.syncWithTextarea();">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }, 1500);

        } catch (error) {
            console.error('Error al previsualizar enlace:', error);
            
            const linkPreview = document.createElement('div');
            linkPreview.className = 'link-preview';
            linkPreview.innerHTML = `
                <div class="link-preview__card" onclick="window.open('${url}', '_blank')">
                    <div class="link-preview__thumbnail link-preview__thumbnail--placeholder"></div>
                    <div class="link-preview__content">
                        <div class="link-preview__site-info">
                            <div class="link-preview__site-name">ENLACE</div>
                        </div>
                        <div class="link-preview__title">Enlace externo</div>
                        <div class="link-preview__description">Haz clic para abrir en una nueva pestaña</div>
                        <div class="link-preview__url">${url}</div>
                    </div>
                    <button class="link-preview__remove" onclick="event.stopPropagation(); this.parentElement.parentElement.remove(); if(window.syncWithTextarea) window.syncWithTextarea();">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.collapse(false);
                range.insertNode(linkPreview);
            }
        }
    }

    // Toggle vista previa
    function togglePreview() {
        if (!previewContainer || !previewContent) return;
        
        isPreviewMode = !isPreviewMode;
        
        if (isPreviewMode) {
            previewContent.innerHTML = editor.innerHTML;
            editor.style.display = 'none';
            previewContainer.style.display = 'block';
            previewToggle.classList.add('active');
            previewToggle.innerHTML = '<i class="fas fa-edit"></i>';
            previewToggle.title = 'Editar';
        } else {
            editor.style.display = 'block';
            previewContainer.style.display = 'none';
            previewToggle.classList.remove('active');
            previewToggle.innerHTML = '<i class="fas fa-eye"></i>';
            previewToggle.title = 'Vista previa';
        }
    }

    // Función global para sincronizar
    window.syncWithTextarea = syncWithTextarea;

    // Inicializar
    updatePlaceholder();
    updateStats();

    // Auto-guardar cada 30 segundos
    setInterval(() => {
        syncWithTextarea();
    }, 30000);

    // Manejar envío del formulario
    const form = editor.closest('form');
    const submitBtn = document.querySelector('.formulario-administrador__boton--guardar-historia');
    
    if (form && submitBtn) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });

        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFormSubmit();
        });
    }

    // Función para manejar el envío del formulario
    async function handleFormSubmit() {
        try {
            syncWithTextarea();
            
            const titulo = document.getElementById('titulo')?.value.trim() || '';
            const autor = document.getElementById('autor')?.value.trim() || '';
            const sinopsis = hiddenTextarea.value.trim() || '';
            
            const errores = [];
            
            if (!titulo) {
                errores.push('El título es obligatorio');
            } else if (titulo.length < 3) {
                errores.push('El título debe tener al menos 3 caracteres');
            } else if (titulo.length > 200) {
                errores.push('El título no puede exceder 200 caracteres');
            }
            
            if (!autor) {
                errores.push('El autor es obligatorio');
            } else if (autor.length < 2) {
                errores.push('El nombre del autor debe tener al menos 2 caracteres');
            } else if (autor.length > 100) {
                errores.push('El nombre del autor no puede exceder 100 caracteres');
            }
            
            if (!sinopsis || editor.textContent.trim().length < 10) {
                errores.push('La sinopsis debe tener al menos 10 caracteres');
            }
            
            if (errores.length > 0) {
                mostrarErrores(errores);
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
            
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('sinopsis', sinopsis);
            formData.append('autor', autor);
            
            const response = await fetch('/admin/historyteling/crear/cargar', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.ok) {
                mostrarExito(result.message || 'Historia guardada correctamente', result.redirect || '/admin/historyteling');
            } else {
                mostrarErrores([result.message || 'Error al guardar la historia']);
            }
            
        } catch (error) {
            console.error('Error al guardar historia:', error);
            mostrarErrores(['Ocurrió un error inesperado al guardar la historia']);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Guardar Historia';
        }
    }

    // Función para mostrar errores
    function mostrarErrores(errores) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                html: `
                    <ul style="text-align: left; margin: 0 auto; list-style: none; padding: 0;">
                        ${errores.map(error => `<li style="margin-bottom: 8px; padding: 8px; background: #fef2f2; border-left: 4px solid #ef4444; color: #dc2626;">${error}</li>`).join('')}
                    </ul>
                `,
                confirmButtonText: 'Corregir',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            });
        } else {
            errores.forEach(error => showNotification(error, 'error'));
        }
    }

    // Función para mostrar éxito
    function mostrarExito(mensaje, redirect) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: mensaje,
                confirmButtonText: 'Continuar',
                customClass: {
                    confirmButton: 'swal2-confirm'
                }
            }).then(() => {
                if (redirect) {
                    window.location.href = redirect;
                }
            });
        } else {
            showNotification(mensaje, 'success');
            setTimeout(() => {
                if (redirect) {
                    window.location.href = redirect;
                }
            }, 2000);
        }
    }

    // Drag & Drop
    editor.addEventListener('dragover', function(e) {
        e.preventDefault();
        editor.classList.add('drag-over');
    });

    editor.addEventListener('dragleave', function(e) {
        e.preventDefault()
        editor.classList.remove('drag-over');
    });

    editor.addEventListener('drop', function(e) {
        e.preventDefault();
        editor.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => uploadImageToServer(file));
        }
    });
});
