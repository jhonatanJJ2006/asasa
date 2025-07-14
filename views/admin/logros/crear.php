<div class="dashboard__contenedor--formulario">
    <h2 class="titulo"><?php echo $titulo ?></h2>

    <div class="admin__contenedor-boton">
        <a class="admin__boton" href="/admin/logros">
            &lt; Volver
        </a>
    </div>

    <form class="formulario-administrador" enctype="multipart/form-data" method="POST">
        <fieldset class="formulario-administrador__fieldset">
            <legend class="formulario-administrador__legend">Información del Logro</legend>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="fecha">Fecha del Logro</label>
                <input 
                    class="formulario-administrador__input" 
                    id="fecha" 
                    name="fecha" 
                    type="date" 
                    required
                    value="<?php echo $logro->fecha ?? '' ?>"
                >
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="titulo">Título</label>
                <input 
                    class="formulario-administrador__input" 
                    id="titulo" 
                    name="titulo" 
                    type="text" 
                    placeholder="Título del logro"
                    required
                    value="<?php echo $logro->titulo ?? '' ?>"
                >
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="descripcion">Descripción</label>
                <textarea 
                    id="descripcion" 
                    class="formulario-administrador__input" 
                    name="descripcion" 
                    rows="7" 
                    placeholder="Describe brevemente el logro"
                    required
                ><?php echo $logro->descripcion ?? '' ?></textarea>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="imagen">Imagen (opcional)</label>
                <div class="formulario-administrador__dropzone" id="dropzone-img">
                    <i class="fa-solid fa-upload"></i>
                    <p>Arrastra y suelta una imagen aquí o haz clic para seleccionar</p>
                    <input class="formulario-administrador__input formulario-administrador__input--file" 
                        id="imagen" 
                        type="file" 
                        name="imagen" 
                        accept="image/*" 
                        hidden
                    >
                    <img class="preview"></img>
                </div>
            </div>

            <div class="formulario-administrador__campo">
                <label class="formulario-administrador__label" for="pdfs">Documentos PDF (opcional, puedes subir varios)</label>
                <input 
                    class="formulario-administrador__input formulario-administrador__input--file"
                    id="pdfs"
                    type="file"
                    name="pdfs[]"
                    accept="application/pdf"
                    multiple
                >
                <div class="formulario-administrador__instruccion">Formatos permitidos: PDF. Puedes seleccionar varios.</div>
            </div>

        </fieldset>

        <button type="submit" class="formulario-administrador__boton formulario-administrador__boton--logro">
            Registrar Logro
        </button>
    </form>
</div>
