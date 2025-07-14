<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

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
                <input class="formulario-administrador__input" id="titulo" name="titulo" type="text" required value="<?php echo $historia->titulo ?>">
            </div>

            <!-- Sinopsis con Quill -->
            <div class="formulario-administrador__campo">
                <label for="editor-sinopsis" class="formulario-administrador__label">Sinopsis</label>

                <!-- Campo oculto para enviar el contenido -->
                <input type="hidden" name="sinopsis" id="sinopsis" value="<?php echo htmlspecialchars($historia->sinopsis ?? '', ENT_QUOTES); ?>">

                <!-- Editor visual de Quill -->
                <div id="editor-sinopsis" class="formulario-administrador__input formulario-administrador__input--editor">
                    <?php echo $historia->sinopsis ?? ''; ?>
                </div>
            </div>


            <!-- Autor -->
            <div class="formulario-administrador__campo">
                <label for="autor" class="formulario-administrador__label">Autor</label>
                <input class="formulario-administrador__input" id="autor" name="autor" type="text" required value="<?php echo $historia->autor ?>">
            </div>
        </fieldset>

        <!-- Botón de Editar -->
        <div class="formulario-administrador__boton formulario-administrador__boton--editar-historia">
            Editar Historia
        </div>
    </form>
</div>