<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/about">
            &lt; Volver
        </a>
    </div>

    <form class="formulario-administrador" enctype="multipart/form-data" method="POST">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Información para Sección Mi Historia</legend>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="imagenes">Imágenes (puedes subir varias)</label>
                <div class="formulario-administrador__dropzone" id="dropzone-img">
                    <i class="fa-solid fa-upload"></i>
                    <p>Arrastra y suelta una o varias imágenes aquí o haz clic para seleccionar</p>
                    <input
                        class="formulario-administrador__input formulario-administrador__input--file"
                        id="imagenes"
                        type="file"
                        name="imagenes[]"
                        accept="image/*"
                        multiple
                        hidden>
                    <div id="imagenes-preview"></div>
                </div>
                <div class="formulario-administrador__instruccion">Formatos permitidos: JPG, PNG, WEBP, AVIF.</div>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="frase">Frase</label>
                <input
                    class="formulario-administrador__input"
                    id="frase"
                    name="frase"
                    type="text"
                    placeholder="Frase Principal"
                    required
                    value="<?php echo $evento->frase ?? '' ?>">
            </div>

            <div class="formulario-administrador__campo formulario-administrador__campo--editor">
                <label class="formulario-administrador__label" for="descripcion">Descripción</label>
                <div class="editor-toolbar">
                    <div class="editor-toolbar__group">
                        <button type="button" class="editor-btn" data-command="bold" title="Negrita">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button type="button" class="editor-btn" data-command="italic" title="Cursiva">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button type="button" class="editor-btn" data-command="underline" title="Subrayado">
                            <i class="fas fa-underline"></i>
                        </button>
                    </div>
                    <div class="editor-toolbar__group">
                        <button type="button" class="editor-btn" data-command="insertUnorderedList" title="Lista">
                            <i class="fas fa-list-ul"></i>
                        </button>
                        <button type="button" class="editor-btn" data-command="insertOrderedList" title="Lista numerada">
                            <i class="fas fa-list-ol"></i>
                        </button>
                    </div>
                    <div class="editor-toolbar__group">
                        <button type="button" class="editor-btn" id="insert-link" title="Insertar enlace">
                            <i class="fas fa-link"></i>
                        </button>
                        <button type="button" class="editor-btn" id="insert-image" title="Insertar imagen">
                            <i class="fas fa-image"></i>
                        </button>
                    </div>
                    <div class="editor-toolbar__group">
                        <button type="button" class="editor-btn" id="preview-toggle" title="Vista previa">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="editor-container">
                    <div class="editor-content" 
                         id="descripcion-editor" 
                         contenteditable="true" 
                         data-placeholder="Escribe tu descripción aquí... Puedes agregar enlaces, imágenes y formato de texto.">
                        <?php echo $evento->descripcion ?? '' ?>
                    </div>
                    <div class="editor-preview" id="descripcion-preview" style="display: none;">
                        <h4>Vista Previa:</h4>
                        <div class="preview-content"></div>
                    </div>
                </div>
                
                <textarea
                    id="descripcion"
                    name="descripcion"
                    style="display: none;"
                    required><?php echo $evento->descripcion ?? '' ?></textarea>
                
                <div class="editor-stats">
                    <span class="char-count">0 caracteres</span>
                    <span class="word-count">0 palabras</span>
                </div>
                <div class="formulario-administrador__instruccion">
                    Descripción de entre 800 a 1300 caracteres. Puedes usar formato de texto, enlaces e imágenes.
                </div>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="numero">Número</label>
                <input
                    class="formulario-administrador__input"
                    id="numero"
                    name="numero"
                    type="tel"
                    placeholder="Número de Teléfono"
                    required
                    value="<?php echo $evento->numero ?? '' ?>">
            </div>
            
            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="email">Email</label>
                <input
                    class="formulario-administrador__input"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value="<?php echo $evento->email ?? '' ?>">
            </div>
            
            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="cv">CV (PDF)</label>
                <input
                    class="formulario-administrador__input formulario-administrador__input--file"
                    id="cv"
                    name="cv"
                    type="file"
                    accept="application/pdf"
                    required>
                <div class="formulario-administrador__instruccion">Solo se acepta archivo en formato PDF.</div>
            </div>

        </fieldset>

        <button type="submit" class="formulario-administrador__boton formulario-administrador__boton--mapa-crear">
            Registrar Mi Historia
        </button>
    </form>
</div>

<script src="/build/js/rich-editor.js"></script>
