// Rich Editor con TinyMCE
(function() {
    'use strict';

    // Configuración de TinyMCE
    const initTinyMCE = () => {
        // Verificar si TinyMCE está disponible
        if (typeof tinymce === 'undefined') {
            console.error('TinyMCE no está cargado');
            return;
        }

        // Inicializar TinyMCE para el editor de sinopsis
        tinymce.init({
            selector: '#sinopsis',
            language: 'es',
            height: 400,
            menubar: false,
            branding: false,
            
            // Plugins esenciales
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
            ],
            
            // Barra de herramientas personalizada con títulos
            toolbar: 'undo redo | formatselect | h1 h2 h3 h4 h5 h6 | bold italic underline strikethrough | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent | ' +
                    'link image media | ' +
                    'forecolor backcolor | ' +
                    'emoticons charmap | ' +
                    'preview code fullscreen | help',
            
            // Configuración de contenido mejorada
            content_style: `
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    font-size: 14px; 
                    line-height: 1.6;
                    color: #333;
                    margin: 1rem;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 1.5em 0 0.8em 0;
                    font-weight: 600;
                    line-height: 1.3;
                }
                h1 {
                    font-size: 2.2em;
                    color: #2980b9;
                    border-bottom: 3px solid #3498db;
                    padding-bottom: 0.3em;
                    margin-top: 0;
                }
                h2 {
                    font-size: 1.8em;
                    color: #2980b9;
                    border-left: 5px solid #3498db;
                    padding-left: 1em;
                }
                h3 {
                    font-size: 1.4em;
                    color: #2c3e50;
                    border-bottom: 2px solid #ecf0f1;
                    padding-bottom: 0.2em;
                }
                h4 {
                    font-size: 1.2em;
                    color: #34495e;
                }
                h5 {
                    font-size: 1.1em;
                    color: #7f8c8d;
                }
                h6 {
                    font-size: 1em;
                    color: #95a5a6;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                blockquote {
                    border-left: 4px solid #0066cc;
                    padding-left: 1rem;
                    margin-left: 0;
                    font-style: italic;
                    color: #666;
                }
            `,
            
            // Configuración de imágenes
            images_upload_url: '/admin/editor/upload',
            images_upload_handler: function (blobInfo, success, failure) {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                
                fetch('/admin/editor/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => response.json())
                .then(result => {
                    if (result.location) {
                        success(result.location);
                    } else {
                        failure('Error al subir la imagen: ' + (result.error || 'Error desconocido'));
                    }
                })
                .catch(error => {
                    failure('Error de conexión: ' + error.message);
                });
            },
            
            // Configuración de archivos
            file_picker_types: 'image',
            file_picker_callback: function(callback, value, meta) {
                if (meta.filetype === 'image') {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    
                    input.onchange = function() {
                        const file = this.files[0];
                        if (file) {
                            const formData = new FormData();
                            formData.append('file', file);
                            
                            fetch('/admin/editor/upload', {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                }
                            })
                            .then(response => response.json())
                            .then(result => {
                                if (result.location) {
                                    callback(result.location, {
                                        alt: file.name,
                                        title: file.name
                                    });
                                } else {
                                    alert('Error al subir la imagen: ' + (result.error || 'Error desconocido'));
                                }
                            })
                            .catch(error => {
                                alert('Error de conexión: ' + error.message);
                            });
                        }
                    };
                    
                    input.click();
                }
            },
            
            // Configuración adicional
            paste_data_images: true,
            paste_as_text: false,
            browser_spellcheck: true,
            contextmenu: "link image table",
            
            // Validación de contenido
            setup: function(editor) {
                editor.on('change', function() {
                    editor.save(); // Sincroniza con el textarea
                });
                
                editor.on('init', function() {
                    console.log('TinyMCE inicializado correctamente para #sinopsis');
                });
                
                // Personalizar el diálogo de insertar imagen
                editor.on('BeforeExecCommand', function(e) {
                    if (e.command === 'mceImage') {
                        // Aquí puedes personalizar el comportamiento del botón de imagen
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
            
            // Configuración de estilo de bloques mejorada
            style_formats: [
                {title: 'Párrafo normal', block: 'p'},
                {title: 'Título principal', block: 'h1', styles: {color: '#2980b9', borderBottom: '3px solid #3498db', paddingBottom: '0.3em'}},
                {title: 'Subtítulo importante', block: 'h2', styles: {color: '#2980b9', borderLeft: '5px solid #3498db', paddingLeft: '1em'}},
                {title: 'Encabezado de sección', block: 'h3', styles: {color: '#2c3e50', fontSize: '1.4em'}},
                {title: 'Subsección', block: 'h4', styles: {color: '#34495e', fontSize: '1.2em'}},
                {title: 'Encabezado menor', block: 'h5', styles: {color: '#7f8c8d', fontSize: '1.1em'}},
                {title: 'Título pequeño', block: 'h6', styles: {color: '#95a5a6', fontSize: '1em', textTransform: 'uppercase'}},
                {title: 'Cita destacada', block: 'blockquote', styles: {borderLeft: '4px solid #0066cc', paddingLeft: '1rem', fontStyle: 'italic', color: '#666'}},
                {title: 'Código', inline: 'code', styles: {backgroundColor: '#f8f9fa', padding: '0.3em 0.6em', borderRadius: '6px', color: '#e74c3c'}}
            ]
        });
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTinyMCE);
    } else {
        initTinyMCE();
    }

    // Utilidades globales para TinyMCE
    window.TinyMCEUtils = {
        // Obtener contenido del editor
        getContent: function(editorId) {
            const editor = tinymce.get(editorId);
            return editor ? editor.getContent() : '';
        },
        
        // Establecer contenido del editor
        setContent: function(editorId, content) {
            const editor = tinymce.get(editorId);
            if (editor) {
                editor.setContent(content);
            }
        },
        
        // Limpiar el editor
        clear: function(editorId) {
            const editor = tinymce.get(editorId);
            if (editor) {
                editor.setContent('');
            }
        },
        
        // Enfocar el editor
        focus: function(editorId) {
            const editor = tinymce.get(editorId);
            if (editor) {
                editor.focus();
            }
        }
    };

    console.log('Rich Editor con TinyMCE cargado correctamente');
})();