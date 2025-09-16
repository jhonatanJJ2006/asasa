<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/about">
            &lt; Volver
        </a>
    </div>

    <form class="formulario-administrador" enctype="multipart/form-data" method="POST" id="formAboutEditar">
        <input type="hidden" name="id" value="<?php echo $about->id ?>">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Información para Sección Mi Historia</legend>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="imagenes">Imágenes (puedes subir varias)</label>
                
                <!-- Imágenes existentes -->
                <?php if (!empty($about->imagenes)): ?>
                    <?php 
                    $imagenesExistentes = [];
                    if (!empty($about->imagenes)) {
                        $imagenesDecoded = json_decode($about->imagenes, true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($imagenesDecoded)) {
                            $imagenesExistentes = $imagenesDecoded;
                        } else {
                            $imagenesExistentes = array_filter(array_map('trim', explode(',', $about->imagenes)));
                        }
                    }
                    ?>
                    <?php if (!empty($imagenesExistentes)): ?>
                        <div class="imagenes-existentes">
                            <h4>Imágenes actuales:</h4>
                            <div class="imagenes-grid" id="imagenes-existentes">
                                <?php foreach ($imagenesExistentes as $imagen): ?>
                                    <div class="imagen-item" data-imagen="<?php echo $imagen ?>">
                                        <img src="/build/img/about/<?php echo $imagen ?>.png" alt="Imagen existente" loading="lazy">
                                        <button type="button" class="btn-eliminar-imagen" data-imagen="<?php echo $imagen ?>">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>

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
                <div class="formulario-administrador__instruccion">Formatos permitidos: JPG, PNG, WEBP, AVIF. Máximo 5MB por imagen.</div>
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
                    value="<?php echo $about->frase ?? '' ?>">
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="descripcion">Descripción</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    placeholder="Escribe tu descripción aquí... Puedes agregar enlaces, imágenes y formato de texto."
                    required><?php echo $about->descripcion ?? '' ?></textarea>
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
                    value="<?php echo $about->numero ?? '' ?>">
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
                    value="<?php echo $about->email ?? '' ?>">
            </div>
            
            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="cv">CV (PDF)</label>
                <input
                    class="formulario-administrador__input formulario-administrador__input--file"
                    id="cv"
                    name="cv"
                    type="file"
                    accept="application/pdf">
                <div class="formulario-administrador__instruccion">Solo se acepta archivo en formato PDF.</div>
            </div>

        </fieldset>

        <button type="submit" class="formulario-administrador__boton formulario-administrador__boton--mapa-crear">
            Actualizar Mi Historia
        </button>
    </form>
</div>

<script src="/build/js/about-editor.js"></script>
<script src="/build/js/about-form.js"></script>
