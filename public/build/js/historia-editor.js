// Historia Editor con TinyMCE - Version simplificada
(function() {
    'use strict';

    // Función para esperar a que TinyMCE esté disponible
    function waitForTinyMCE(callback, maxAttempts = 10) {
        let attempts = 0;
        
        function checkTinyMCE() {
            attempts++;
            
            if (typeof tinymce !== 'undefined') {
                callback();
            } else if (attempts < maxAttempts) {
                console.log('TinyMCE no está cargado, reintentando en 1 segundo...');
                setTimeout(checkTinyMCE, 1000);
            } else {
                console.error('TinyMCE no se pudo cargar después de ' + maxAttempts + ' intentos');
            }
        }
        
        checkTinyMCE();
    }

    // Función principal para inicializar el editor
    function initHistoriaEditor() {
        // Verificar si el elemento del editor existe (sinopsis o descripcion)
        var editorElement = document.getElementById('sinopsis') || document.getElementById('descripcion');
        if (!editorElement) {
            console.log('Editor no encontrado en esta página');
            return;
        }

        var editorId = editorElement.id;

        // Configuración de TinyMCE
        tinymce.init({
            selector: '#' + editorId,
            language: 'es',
            height: 450,
            menubar: false,
            branding: false,
            promotion: false,
            base_url: '/tinymce/tinymce/js/tinymce',
            suffix: '.min',
            
            // Plugins esenciales
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
                'autosave', 'paste'
            ],
            
            // Barra de herramientas mejorada con títulos
            toolbar: [
                'undo redo | formatselect | h1 h2 h3 h4 h5 h6 | bold italic underline strikethrough | forecolor backcolor',
                'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
                'link image media | emoticons charmap | preview code fullscreen | help'
            ],
            
            // Estilos de contenido

            content_style: 'body { font-family: Georgia, Times, serif; font-size: 16px; line-height: 1.8; color: #2c3e50; margin: 2rem; } ' +
                          'p { margin: 0 0 1.2em 0; text-align: justify; } ' +
                          'h1, h2, h3, h4, h5, h6 { font-family: Arial, sans-serif; margin: 1.5em 0 0.8em 0; font-weight: 600; } ' +
                          'h1 { font-size: 2.2em; border-bottom: 3px solid #3498db; padding-bottom: 0.3em; color: #2980b9; margin-top: 0; } ' +
                          'h2 { font-size: 1.8em; border-left: 5px solid #3498db; padding-left: 1em; color: #2980b9; } ' +
                          'h3 { font-size: 1.4em; color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 0.2em; } ' +
                          'h4 { font-size: 1.2em; color: #34495e; } ' +
                          'h5 { font-size: 1.1em; color: #7f8c8d; } ' +
                          'h6 { font-size: 1em; color: #95a5a6; text-transform: uppercase; letter-spacing: 0.1em; } ' +
                          'img { max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.15); margin: 1.5em auto; display: block; } ' +
                          'blockquote { border-left: 5px solid #3498db; padding: 1.5em 2em; margin: 2em 0; background: #ecf0f1; font-style: italic; color: #2c3e50; border-radius: 0 12px 12px 0; } ' +
                          'a { color: #3498db; text-decoration: none; } ' +
                          'a:hover { text-decoration: underline; } ' +
                          'ul, ol { margin: 1.5em 0; padding-left: 2.5em; } ' +
                          'li { margin: 0.8em 0; line-height: 1.6; } ' +
                          'code { background: #f8f9fa; padding: 0.3em 0.6em; border-radius: 6px; font-size: 0.9em; color: #e74c3c; } ' +
                          'pre { background: #2c3e50; color: #ecf0f1; padding: 1.5em; border-radius: 12px; overflow-x: auto; margin: 2em 0; } ' +
                          'strong, b { font-weight: 700; color: #2c3e50; } ' +
                          'em, i { font-style: italic; color: #7f8c8d; }',
            
            // Configuración de imágenes
            images_upload_url: '/admin/editor/upload',
            images_upload_handler: function (blobInfo, success, failure) {
                var formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                
                // Crear indicador de carga simple
                var loadingDiv = document.createElement('div');
                loadingDiv.innerHTML = 'Subiendo imagen...';
                loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 1rem 2rem; border-radius: 8px; z-index: 9999;';
                document.body.appendChild(loadingDiv);
                
                fetch('/admin/editor/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {
                    document.body.removeChild(loadingDiv);
                    
                    if (result.location) {
                        success(result.location);
                        
                        // Mostrar notificación de éxito
                        tinymce.get('sinopsis').notificationManager.open({
                            text: '¡Imagen subida exitosamente!',
                            type: 'success',
                            timeout: 3000
                        });
                    } else {
                        failure('Error al subir la imagen: ' + (result.error || 'Error desconocido'));
                    }
                })
                .catch(function(error) {
                    document.body.removeChild(loadingDiv);
                    failure('Error de conexión: ' + error.message);
                });
            },
            
            // Configuración de archivos
            file_picker_types: 'image',
            file_picker_callback: function(callback, value, meta) {
                if (meta.filetype === 'image') {
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.multiple = false;
                    
                    input.onchange = function() {
                        var file = this.files[0];
                        if (!file) return;
                        
                        // Validaciones básicas
                        if (file.size > 5 * 1024 * 1024) {
                            alert('El archivo es demasiado grande. Tamaño máximo: 5MB');
                            return;
                        }
                        
                        var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                        if (allowedTypes.indexOf(file.type) === -1) {
                            alert('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, GIF y WebP');
                            return;
                        }
                        
                        var formData = new FormData();
                        formData.append('file', file);
                        
                        fetch('/admin/editor/upload', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(result) {
                            if (result.location) {
                                callback(result.location, {
                                    alt: file.name.split('.')[0],
                                    title: file.name.split('.')[0]
                                });
                            } else {
                                alert('Error al subir la imagen: ' + (result.error || 'Error desconocido'));
                            }
                        })
                        .catch(function(error) {
                            alert('Error de conexión: ' + error.message);
                        });
                    };
                    
                    input.click();
                }
            },
            
            // Configuración adicional
            paste_data_images: true,
            paste_as_text: false,
            browser_spellcheck: true,
            contextmenu: "link image table",
            
            // Auto-guardado
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: 'historia_sinopsis_',
            autosave_restore_when_empty: true,
            
            // Setup del editor
            setup: function(editor) {
                var wordCountElement = null;
                
                editor.on('init', function() {
                    console.log('Editor TinyMCE inicializado para historias');
                    
                    // Crear contador de palabras
                    var editorContainer = editor.getContainer();
                    var statusBar = editorContainer.querySelector('.tox-statusbar');
                    
                    if (statusBar) {
                        wordCountElement = document.createElement('div');
                        wordCountElement.style.cssText = 'position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); font-size: 12px; color: #666; display: flex; gap: 1rem;';
                        statusBar.style.position = 'relative';
                        statusBar.appendChild(wordCountElement);
                        
                        updateWordCount();
                    }
                });
                
                editor.on('change keyup', function() {
                    editor.save();
                    updateWordCount();
                });
                
                function updateWordCount() {
                    if (!wordCountElement) return;
                    
                    var content = editor.getContent({format: 'text'});
                    var words = content.trim() ? content.trim().split(/\s+/).length : 0;
                    var chars = content.length;
                    
                    wordCountElement.innerHTML = '<span><strong>' + chars + '</strong> caracteres</span>' +
                                                  '<span><strong>' + words + '</strong> palabras</span>';
                }
                
                // Atajo de teclado para guardar
                editor.addShortcut('ctrl+s', 'Guardar', function() {
                    var form = document.getElementById('form-crear-historia');
                    if (form) {
                        var submitBtn = form.querySelector('button[type="submit"]');
                        if (submitBtn) {
                            submitBtn.click();
                        }
                    }
                });
            },
            
            // Configuración de formato
            formats: {
                alignleft: {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: {textAlign: 'left'}},
                aligncenter: {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: {textAlign: 'center'}},
                alignright: {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: {textAlign: 'right'}},
                alignjustify: {selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: {textAlign: 'justify'}}
            },
            
            // Estilos de formato mejorados
            style_formats: [
                {title: 'Párrafo normal', block: 'p'},
                {title: 'Título principal', block: 'h1', styles: {color: '#2980b9', borderBottom: '3px solid #3498db', paddingBottom: '0.3em'}},
                {title: 'Subtítulo importante', block: 'h2', styles: {color: '#2980b9', borderLeft: '5px solid #3498db', paddingLeft: '1em'}},
                {title: 'Encabezado de sección', block: 'h3', styles: {color: '#2c3e50', fontSize: '1.4em'}},
                {title: 'Subsección', block: 'h4', styles: {color: '#34495e', fontSize: '1.2em'}},
                {title: 'Encabezado menor', block: 'h5', styles: {color: '#7f8c8d', fontSize: '1.1em'}},
                {title: 'Título pequeño', block: 'h6', styles: {color: '#95a5a6', fontSize: '1em', textTransform: 'uppercase'}},
                {title: 'Cita destacada', block: 'blockquote', styles: {borderLeft: '5px solid #3498db', paddingLeft: '1.5em', fontStyle: 'italic', color: '#2c3e50'}},
                {title: 'Código', inline: 'code', styles: {backgroundColor: '#f8f9fa', padding: '0.3em 0.6em', borderRadius: '6px', color: '#e74c3c'}}
            ],
            
            // Elementos válidos
            invalid_elements: 'script,object,embed,iframe',
            extended_valid_elements: 'img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name]',
            
            // Configuración de accesibilidad
            a11y_advanced_options: true,
            
            // Callback final
            init_instance_callback: function(editor) {
                setTimeout(function() {
                    editor.focus();
                }, 100);
                
                var container = editor.getContainer();
                if (container) {
                    container.classList.add('historia-editor-container');
                }
            }
        });
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            waitForTinyMCE(initHistoriaEditor);
        });
    } else {
        waitForTinyMCE(initHistoriaEditor);
    }

    // Utilidades globales para el editor de historias
    window.HistoriaEditorUtils = {
        getContent: function(editorId) {
            var targetId = editorId || 'sinopsis';
            var editor = tinymce.get(targetId);
            return editor ? editor.getContent() : '';
        },
        
        setContent: function(content, editorId) {
            var targetId = editorId || 'sinopsis';
            var editor = tinymce.get(targetId);
            if (editor) {
                editor.setContent(content || '');
            }
        },
        
        clear: function(editorId) {
            var targetId = editorId || 'sinopsis';
            var editor = tinymce.get(targetId);
            if (editor) {
                editor.setContent('');
                editor.focus();
            }
        },
        
        insertText: function(text, editorId) {
            var targetId = editorId || 'sinopsis';
            var editor = tinymce.get(targetId);
            if (editor) {
                editor.insertContent(text);
            }
        },
        
        getStats: function(editorId) {
            var targetId = editorId || 'sinopsis';
            var editor = tinymce.get(targetId);
            if (!editor) return {words: 0, chars: 0};
            
            var content = editor.getContent({format: 'text'});
            var words = content.trim() ? content.trim().split(/\s+/).length : 0;
            var chars = content.length;
            
            return {words: words, chars: chars};
        },
        
        validateContent: function(editorId) {
            var targetId = editorId || 'sinopsis';
            var content = this.getContent(targetId);
            var stats = this.getStats(targetId);
            
            if (stats.words < 10) {
                return {
                    valid: false,
                    message: 'El contenido debe tener al menos 10 palabras.'
                };
            }
            
            if (stats.chars > 5000) {
                return {
                    valid: false,
                    message: 'El contenido no puede exceder los 5000 caracteres.'
                };
            }
            
            return {valid: true, message: 'Contenido válido'};
        }
    };

    console.log('Historia Editor con TinyMCE cargado correctamente');
})();