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

            <!-- Sinopsis con Editor TinyMCE -->
            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="sinopsis">Sinopsis</label>
                <textarea
                    id="sinopsis"
                    name="sinopsis"
                    placeholder="Escribe la sinopsis de tu historia aquí..."
                    required></textarea>
                <div class="formulario-administrador__instruccion">
                    Sinopsis de la historia. Puedes usar formato de texto, enlaces e imágenes que se subirán automáticamente al servidor.
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

<!-- TinyMCE Local -->
<script src="/tinymce/tinymce/js/tinymce/tinymce.min.js"></script>
<script src="/build/js/historia-editor.js"></script>
<script src="/build/js/historia-form.js"></script>
