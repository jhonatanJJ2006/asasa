<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/mapa">
            &lt; Volver
        </a>
    </div>

    <form class="formulario-administrador" enctype="multipart/form-data" method="POST">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Información del Evento Mapa</legend>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="fecha">Fecha del Evento</label>
                <input
                    class="formulario-administrador__input"
                    id="fecha"
                    name="fecha"
                    type="date"
                    required
                    value="<?php echo $evento->fecha ?? '' ?>">
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="nombre">Nombre del Evento</label>
                <input
                    class="formulario-administrador__input"
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Nombre del evento"
                    required
                    value="<?php echo $evento->nombre ?? '' ?>">
            </div>

            <!-- CAMPO DE CIUDAD -->
            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="ciudad">Ciudad</label>
                <select
                    id="ciudad"
                    name="ciudad"
                    class="formulario-administrador__input"
                    required>
                    <option value="">-- Selecciona una ciudad --</option>
                    <?php
                    foreach ($ciudades as $ciudad) {
                        $selected = (isset($evento->ciudad) && $evento->ciudad === $ciudad) ? 'selected' : '';
                        echo "<option value=\"$ciudad\" $selected>$ciudad</option>";
                    }
                    ?>
                </select>
            </div>
            <!-- FIN CAMPO CIUDAD -->

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="descripcion">Descripción</label>
                <textarea
                    id="descripcion"
                    class="formulario-administrador__input"
                    name="descripcion"
                    rows="7"
                    placeholder="Describe brevemente el evento"
                    required><?php echo $evento->descripcion ?? '' ?></textarea>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="imagenes_actuales">Imágenes Actuales</label>
                <?php
                $imagenes_actuales = [];
                if (!empty($evento->imagenes)) {
                    $imagenes_actuales = json_decode($evento->imagenes, true);
                }
                ?>
                <?php if (!empty($imagenes_actuales)) { ?>
                    <?php if (count($imagenes_actuales) > 1) { ?>
                        <div class="swiper imagenes-swiper-admin" style="max-width: 340px;">
                            <div class="swiper-wrapper">
                                <?php foreach ($imagenes_actuales as $img) {
                                    $imagePath = "/build/img/mapa/$img";
                                ?>
                                    <div class="swiper-slide">
                                        <picture>
                                            <?php if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.avif')) { ?>
                                                <source srcset="<?php echo $imagePath . '.avif'; ?>" type="image/avif">
                                            <?php } ?>
                                            <?php if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.webp')) { ?>
                                                <source srcset="<?php echo $imagePath . '.webp'; ?>" type="image/webp">
                                            <?php } ?>
                                            <source srcset="<?php echo $imagePath . '.png'; ?>" type="image/png">
                                            <img src="<?php echo $imagePath . '.png'; ?>" alt="Imagen Evento" style="max-width: 320px; border-radius: 8px;">
                                        </picture>
                                    </div>
                                <?php } ?>
                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    <?php } else { ?>
                        <?php
                        $img = $imagenes_actuales[0];
                        $imagePath = "/build/img/mapa/$img";
                        ?>
                        <picture>
                            <?php if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.avif')) { ?>
                                <source srcset="<?php echo $imagePath . '.avif'; ?>" type="image/avif">
                            <?php } ?>
                            <?php if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.webp')) { ?>
                                <source srcset="<?php echo $imagePath . '.webp'; ?>" type="image/webp">
                            <?php } ?>
                            <source srcset="<?php echo $imagePath . '.png'; ?>" type="image/png">
                            <img
                                src="<?php echo $imagePath . '.png'; ?>"
                                alt="Imagen Evento"
                                style="max-width: 320px; border-radius: 8px; display: block; margin: 0 auto;">

                        </picture>
                    <?php } ?>
                <?php } else { ?>
                    <div style="color:#666;">No hay imágenes registradas para este evento.</div>
                <?php } ?>
            </div>

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
                <label class="formulario-administrador__label" for="items">Items (opcional)</label>
                <textarea
                    id="items"
                    class="formulario-administrador__input"
                    name="items"
                    rows="4"
                    placeholder="Puedes agregar información adicional o datos relevantes"><?php echo $evento->items ?? '' ?></textarea>
            </div>
        </fieldset>

        <div class="formulario-administrador__boton formulario-administrador__boton--mapa-editar">Actualizar Evento</div>
    </form>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const swiperEl = document.querySelector('.imagenes-swiper-admin');
        if (swiperEl && typeof Swiper !== 'undefined') {
            new Swiper(swiperEl, {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 8,
                pagination: {
                    el: swiperEl.querySelector('.swiper-pagination'),
                    clickable: true,
                },
            });
        }
    });
</script>