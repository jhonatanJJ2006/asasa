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

            <!-- Sinopsis con Quill -->
            <div class="formulario-administrador__campo">
                <label for="editor-sinopsis" class="formulario-administrador__label">Sinopsis</label>
                <div id="editor-sinopsis" class="formulario-administrador__input formulario-administrador__input--editor"></div>
            </div>

            <!-- Autor -->
            <div class="formulario-administrador__campo">
                <label for="autor" class="formulario-administrador__label">Autor</label>
                <input class="formulario-administrador__input" id="autor" name="autor" type="text" required>
            </div>
        </fieldset>

        <!-- Botón de guardar -->
        <div class="formulario-administrador__boton formulario-administrador__boton--guardar-historia">
            Guardar Historia
        </div>
    </form>
</div>
