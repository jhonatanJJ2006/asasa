<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/miembrosColectivo">
            &lt; Volver
        </a>
    </div>

    <div class="formulario-administrador__crear"></div>

    <form class="formulario-administrador" enctype="multipart/form-data" method="POST">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Información</legend>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="nombre">Nombre</label>
                <input class="formulario-administrador__input" id="nombre" type="text" placeholder="Nombre del Miembro" name="nombre" value="<?php echo $miembro->nombre ?? '' ?>">
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="descripcion">Descripción</label>
                <textarea id="descripcion" class="formulario-administrador__input" name="descripcion" rows="15" placeholder="Descripción del Miembro"><?php echo $miembro->descripcion ?? '' ?></textarea>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="adicionales">Imagen Actual</label>
                <div class="formulario-administrador__imagen">

                    <picture>
                        <?php
                        $imagePath = '/build/img/miembrosColectivo/' . $miembro->imagen;

                        // Verifica si existe el archivo AVIF y añade la etiqueta <source> si es así
                        if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.avif')) { ?>
                            <source srcset="<?php echo $imagePath . '.avif'; ?>" type="image/avif">
                        <?php }

                        // Verifica si existe el archivo WEBP y añade la etiqueta <source> si es así
                        if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.webp')) { ?>
                            <source srcset="<?php echo $imagePath . '.webp'; ?>" type="image/webp">
                        <?php } ?>

                        <!-- Siempre muestra la imagen PNG como fallback -->
                        <source srcset="<?php echo $imagePath . '.png'; ?>" type="image/png">
                        <img src="/build/img/miembrosColectivo/<?php echo htmlspecialchars($miembro->imagen); ?>.png" alt="Imagen de <?php echo htmlspecialchars($miembro->nombre); ?>">
                    </picture>

                </div>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="imagen">Imagen</label>

                <div class="formulario-administrador__dropzone" id="dropzone">
                    <i class="fa-solid fa-upload"></i>
                    <p>Arrastra y suelta una imagen aquí o haz clic para seleccionar una</p>
                    <input class="formulario-administrador__input formulario-administrador__input--file" id="imagen" type="file" name="imagen" accept="image/*" hidden>
                    <img class="preview"></img>
                </div>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="adicionales">Items (Separar por comas)</label>
                <input class="formulario-administrador__input" id="adicionales" type="text" placeholder="Adicionales de Miembro" value="">
                <input id="tagsHidden" type="hidden" name="adicionales" value="<?php echo $miembro->items ?>">

                <div class="formulario-administrador__instruccion">Doble Click para Eliminar Tag</div>

                <div class="formulario-administrador__tagsDiv tagsDiv"></div>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="adicionales">Redes Sociales (Opcional)</label>

                <div class="formulario-administrador__contenedor--icono">
                    <div class="formulario-administrador__icono"><i class="fa-brands fa-facebook-f"></i></div>
                    <input type="text" class="formulario-administrador__input--sociales" data-red="facebook" placeholder="Facebook" value="<?php echo $facebook ?>">
                </div>
                <div class="formulario-administrador__contenedor--icono">
                    <div class="formulario-administrador__icono"><i class="fa-solid fa-x"></i></div>
                    <input type="text" class="formulario-administrador__input--sociales" data-red="x" placeholder="X(Twitter)" value="<?php echo $x ?>">
                </div>
                <div class="formulario-administrador__contenedor--icono">
                    <div class="formulario-administrador__icono"><i class="fa-brands fa-youtube"></i></div>
                    <input type="text" class="formulario-administrador__input--sociales" data-red="youtube" placeholder="Youtube" value="<?php echo $youtube ?>">
                </div>
                <div class="formulario-administrador__contenedor--icono">
                    <div class="formulario-administrador__icono"><i class="fa-brands fa-instagram"></i></div>
                    <input type="text" class="formulario-administrador__input--sociales" data-red="instagram" placeholder="Instagram" value="<?php echo $instagram ?>">
                </div>
                <div class="formulario-administrador__contenedor--icono">
                    <div class="formulario-administrador__icono"><i class="fa-brands fa-tiktok"></i></div>
                    <input type="text" class="formulario-administrador__input--sociales" data-red="tiktok" placeholder="Tiktok" value="<?php echo $tiktok ?>">
                </div>

            </div>
        </fieldset>

        <div class="formulario-administrador__boton formulario-administrador__boton--miembroColectivo-editar">Actualizar Miembro</div>
    </form>
</div>