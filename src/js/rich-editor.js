document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('descripcion-editor');
    const hiddenTextarea = document.getElementById('descripcion');
    const previewContainer = document.getElementById('descripcion-preview');
    const previewContent = previewContainer.querySelector('.preview-content');
    const previewToggle = document.getElementById('preview-toggle');
    const charCount = document.querySelector('.char-count');
    const wordCount = document.querySelector('.word-count');

    if (!editor) return;

    let isPreviewMode = false;

    // Función para actualizar contadores
    function updateStats() {
        const text = editor.textContent || editor.innerText || '';
        const chars = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        
        charCount.textContent = `${chars} caracteres`;
        wordCount.textContent = `${words} palabras`;
        
        // Actualizar color según límites
        if (chars < 800) {
            charCount.style.color = '#ef4444'; // Rojo - muy poco
        } else if (chars <= 1300) {
            charCount.style.color = '#22c55e'; // Verde - perfecto
        } else {
            charCount.style.color = '#f59e0b'; // Amarillo - demasiado
        }
    }

    // Función para sincronizar con textarea oculta
    function syncWithTextarea() {
        hiddenTextarea.value = editor.innerHTML;
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
    document.getElementById('insert-link').addEventListener('click', function(e) {
        e.preventDefault();
        showLinkModal();
    });

    // Insertar imagen
    document.getElementById('insert-image').addEventListener('click', function(e) {
        e.preventDefault();
        showImageModal();
    });

    // Toggle preview
    previewToggle.addEventListener('click', function(e) {
        e.preventDefault();
        togglePreview();
    });

    // Modal para enlaces
    function showLinkModal() {
        const url = prompt('Ingresa la URL del enlace:');
        if (url) {
            const text = window.getSelection().toString() || prompt('Texto del enlace:') || url;
            const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="editor-link">${text}</a>`;
            document.execCommand('insertHTML', false, linkHtml);
            
            // Previsualizar enlace
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
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = `<img src="${e.target.result}" alt="Imagen insertada" class="editor-image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;">`;
                    document.execCommand('insertHTML', false, img);
                    syncWithTextarea();
                };
                reader.readAsDataURL(file);
            }
        });
        
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    // Previsualización de enlaces
    async function previewLink(url) {
        try {
            // Crear elemento de previsualización
            const linkPreview = document.createElement('div');
            linkPreview.className = 'link-preview';
            linkPreview.innerHTML = `
                <div class="link-preview__loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Cargando previsualización...</span>
                </div>
            `;

            // Insertar después del enlace
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.collapse(false);
                range.insertNode(linkPreview);
            }

            // Simular carga de metadatos (en producción, esto sería una llamada API)
            setTimeout(() => {
                const domain = new URL(url).hostname;
                linkPreview.innerHTML = `
                    <div class="link-preview__card">
                        <div class="link-preview__favicon">
                            <img src="https://www.google.com/s2/favicons?domain=${domain}" alt="Favicon" onerror="this.style.display='none'">
                        </div>
                        <div class="link-preview__content">
                            <div class="link-preview__title">${domain}</div>
                            <div class="link-preview__description">Enlace externo</div>
                            <div class="link-preview__url">${url}</div>
                        </div>
                        <button class="link-preview__remove" onclick="this.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }, 1000);

        } catch (error) {
            console.error('Error al previsualizar enlace:', error);
        }
    }

    // Toggle vista previa
    function togglePreview() {
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

    // Inicializar
    updatePlaceholder();
    updateStats();

    // Auto-guardar cada 30 segundos
    setInterval(() => {
        syncWithTextarea();
    }, 30000);

    // Guardar antes de enviar formulario
    const form = editor.closest('form');
    if (form) {
        form.addEventListener('submit', function() {
            syncWithTextarea();
        });
    }
});
