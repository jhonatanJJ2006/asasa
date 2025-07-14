<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/agenda">
            &lt; Volver
        </a>
    </div>

    <div class="formulario-administrador__crear"></div>

    <form class="formulario-administrador" enctype="multipart/form-data" method="POST">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Información</legend>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="nombre">Nombre</label>
                <input class="formulario-administrador__input" id="nombre" type="text" placeholder="Nombre del Evento" name="nombre" value="<?php echo $informacion->nombre ?? '' ?>">
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="descripcion">Descripción</label>
                <textarea id="descripcion" class="formulario-administrador__input" name="descripcion" rows="15" placeholder="Descripción del Evento"><?php echo $informacion->sinopsis ?? '' ?></textarea>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="fecha">Fecha</label>
                <input class="formulario-administrador__input" id="fecha" type="date" placeholder="Fecha del Evento" name="fecha" value="<?php echo $informacion->nombre ?? '' ?>">
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="hora">Hora</label>
                <input class="formulario-administrador__input" id="hora" type="time" placeholder="Hora del Evento" name="hora" value="<?php echo $informacion->nombre ?? '' ?>">
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="tipo">Tipo de Evento</label>
                <select class="formulario-administrador__input" id="tipo" name="tipo">
                    <option value="presencial" <?php echo ($informacion->nombre ?? '') === 'presencial' ? 'selected' : '' ?>>Presencial</option>
                    <option value="virtual" <?php echo ($informacion->nombre ?? '') === 'virtual' ? 'selected' : '' ?>>Virtual</option>
                </select>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="lugar">Lugar</label>
                <input class="formulario-administrador__input" id="lugar" type="text" placeholder="Lugar del Evento" name="lugar" value="<?php echo $informacion->nombre ?? '' ?>">
            </div>

        </fieldset>

        <div class="formulario-administrador__boton formulario-administrador__boton--evento">Registrar Evento</div>
    </form>
</div>