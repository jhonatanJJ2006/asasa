<div class="dashboard__contenedor--formulario">
    <h2 class="titulo">Crear Historia</h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/historyteling">
            &lt; Volver
        </a>
    </div>

    <form class="formulario-administrador" method="POST" id="form-crear-historia">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Datos de la historia</legend>

            <!-- Título -->
            <div class="formulario-administrador__campo">
                <label for="titulo" class="formulario-administrador__label">Título</label>
                <input class="formulario-administrador__input" id="titulo" name="titulo" type="text" required>
            </div>

            <!-- Sinopsis con Editor Enriquecido -->
            <div class="formulario-administrador__campo formulario-administrador__campo--editor">
                <label class="formulario-administrador__label" for="sinopsis">Sinopsis</label>
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
                        <button type="button" class="editor-btn" id="insert-link-historia" title="Insertar enlace">
                            <i class="fas fa-link"></i>
                        </button>
                        <button type="button" class="editor-btn" id="insert-image-historia" title="Insertar imagen">
                            <i class="fas fa-image"></i>
                        </button>
                    </div>
                    <div class="editor-toolbar__group">
                        <button type="button" class="editor-btn" id="preview-toggle-historia" title="Vista previa">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="editor-container">
                    <div class="editor-content" 
                         id="sinopsis-editor" 
                         contenteditable="true" 
                         data-placeholder="Escribe la sinopsis de tu historia aquí... Puedes agregar enlaces, imágenes y formato de texto.">
                    </div>
                    <div class="editor-preview" id="sinopsis-preview" style="display: none;">
                        <h4>Vista Previa:</h4>
                        <div class="preview-content"></div>
                    </div>
                </div>
                
                <textarea
                    id="sinopsis"
                    name="sinopsis"
                    style="display: none;"
                    required></textarea>
                
                <div class="editor-stats">
                    <span class="char-count-historia">0 caracteres</span>
                    <span class="word-count-historia">0 palabras</span>
                </div>
                <div class="formulario-administrador__instruccion">
                    Sinopsis de la historia. Puedes usar formato de texto, enlaces e imágenes que se guardarán en el servidor.
                </div>
            </div>

            <!-- Autor -->
            <div class="formulario-administrador__campo">
                <label for="autor" class="formulario-administrador__label">Autor</label>
                <input class="formulario-administrador__input" id="autor" name="autor" type="text" required>
            </div>
        </fieldset>

        <!-- Botón de guardar -->
        <button type="submit" class="formulario-administrador__boton formulario-administrador__boton--guardar-historia">
            Guardar Historia
        </button>
    </form>
</div>

<script src="/build/js/historia-editor.js"></script>
