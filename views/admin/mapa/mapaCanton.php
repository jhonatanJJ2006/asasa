<h2 class="titulo"><?php echo $titulo ?></h2>

<div class="admin__contenedor-boton">
    <a class="admin__boton" href="/admin/mapa">
        <i class="fa-solid fa-circle-arrow-left"></i>
        Volver
    </a>
</div>

<main class="canton-info">
  <div class="canton-info__gallery">
    <div class="canton-info__gallery-box" id="drop-area">

      <!-- Carrusel de imágenes (inicialmente oculto) -->
      <div class="canton-info__carousel" id="carousel" style="display: none;">
        <!-- Las imágenes se insertarán aquí dinámicamente -->
      </div>

      <!-- Mensaje cuando no hay imágenes -->
      <p class="canton-info__gallery-message" id="no-images-msg">No hay imágenes</p>

      <!-- Input y botón para subir imágenes -->
      <input type="file" id="fileElem" class="canton-info__input" accept="image/*" multiple>
      <label for="fileElem" class="canton-info__gallery-btn">Añadir imágenes</label>
    </div>
  </div>

  <div class="canton-info__details">
    <h2 class="canton-info__title">Información</h2>

    <form class="canton-info__form">
      <div class="canton-info__form-group">
        <label for="descripcion" class="canton-info__label">Descripción</label>
        <textarea id="descripcion" class="canton-info__textarea" rows="5" placeholder="Escribe aquí..."></textarea>
      </div>
      <button type="submit" class="canton-info__submit">Guardar Información</button>
    </form>
  </div>
</main>

<!-- Carrusel de imágenes fuera de la sección principal -->
<div class="canton-info__external-carousel" id="external-carousel" style="display: none;">
  <!-- Imágenes externas si se desea mostrar aparte -->
</div>
