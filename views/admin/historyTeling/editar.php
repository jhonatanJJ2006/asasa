<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/historyteling">
            &lt; Volver
        </a>
    </div>

    <form class="formulario-administrador" method="POST" id="form-editar-historia">
        <input type="hidden" name="id" value="<?php echo $historia->id ?>">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Datos de la historia</legend>

            <!-- Título -->
            <div class="formulario-administrador__campo">
                <label for="titulo" class="formulario-administrador__label">Título</label>
                <input class="formulario-administrador__input" id="titulo" name="titulo" type="text" required value="<?php echo $historia->titulo ?>">
            </div>

            <!-- Sinopsis con TinyMCE -->
            <div class="formulario-administrador__campo">
                <label for="sinopsis" class="formulario-administrador__label">Sinopsis</label>
                <textarea id="sinopsis" name="sinopsis" placeholder="Escribe la sinopsis de tu historia aquí... Puedes agregar enlaces, imágenes y formato de texto." required><?php echo htmlspecialchars_decode($historia->sinopsis ?? '', ENT_QUOTES) ?></textarea>
                <div class="formulario-administrador__instruccion">
                    Sinopsis de entre 100 a 1000 caracteres. Puedes usar formato de texto, enlaces e imágenes.
                </div>
            </div>

            <!-- Autor -->
            <div class="formulario-administrador__campo">
                <label for="autor" class="formulario-administrador__label">Autor</label>
                <input class="formulario-administrador__input" id="autor" name="autor" type="text" required value="<?php echo $historia->autor ?>">
            </div>
        </fieldset>

        <!-- Botón de Editar -->
        <button type="submit" class="formulario-administrador__boton formulario-administrador__boton--editar-historia" id="btn-editar-historia">
            <i class="fa-solid fa-save"></i>
            Actualizar Historia
        </button>
    </form>
</div>

<!-- SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Scripts -->
<script src="/build/js/historia-editor.js"></script>
<script src="/build/js/historia-form.js"></script>