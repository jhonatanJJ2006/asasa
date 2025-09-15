<section class="logros" id="logros">
  <div class="logros__contenedor">
    <h2 class="titulo">Logros para Loja y el País</h2>

    <?php if ($logrosDestacados) { ?>

      <div class="logros__swiper">

        <div class="swiper logros-swiper">
          <div class="swiper-wrapper">

            <?php foreach ($logrosDestacados as $logroDestacado) { ?>

              <div class="swiper-slide">
                <div class="logros__slide-content">
                  <picture>
                    <source srcset="/build/img/logros/<?php echo $logroDestacado->imagen; ?>.webp" type="image/webp">
                    <source srcset="/build/img/logros/<?php echo $logroDestacado->imagen; ?>.png" type="image/png">
                    <img src="/build/img/logros/<?php echo $logroDestacado->imagen; ?>.png" alt="Logro destacado <?php echo $logroDestacado->titulo ?>" class="logros__slide-img" loading="lazy">
                  </picture>
                  <div class="logros__slide-overlay">
                    <h3><?php echo $logroDestacado->titulo ?></h3>
                    <p><?php echo strlen($logroDestacado->descripcion) > 250 ? substr($logroDestacado->descripcion, 0, 250) . '...' : $logroDestacado->descripcion; ?></p>
                  </div>
                </div>
              </div>

            <?php } ?>

          </div>
          
          <!-- Navegación -->
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>

          <!-- Paginación -->
          <div class="swiper-pagination"></div>
        </div>

      <?php } ?>

      <div class="timeline-container">
        <div class="logros__indicacion">
          <div class="indicacion__content">
            <h4>¿Cómo usar la línea de tiempo?</h4>
            <ul>
              <li><strong>Click en un año</strong> para ver los meses</li>
              <li><strong>Click en un mes</strong> para ver los días</li>
              <li><strong>Click en un día</strong> para ver el detalle del logro</li>
              <li><strong>Desliza horizontalmente</strong> para moverte por la línea de tiempo</li>
            </ul>
          </div>
        </div>

        <div class="logros__timeline" id="timeline"></div>

        <div class="logros__fecha-actual" id="fechaActual"></div>
      </div>

      <!-- Modal original -->
      <div class="logros__modal" id="logrosModal">
        <div class="logros__modal-content" id="logrosModalContent">
          <!-- Contenido generado dinámicamente por JavaScript -->
        </div>
      </div>
      </div>
</section>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const logrosSection = document.querySelector('.logros');
    if (logrosSection) {
      Swal.fire({
        title: 'Logros para Loja y el País',
        text: '¡Explora la línea de tiempo y descubre los principales hitos!',
        showConfirmButton: false,
        timer: 5200,
        timerProgressBar: true,
        background: 'linear-gradient(135deg, #14524a 0%, #22405e 75%, #2f7ad8 100%)',
        color: '#fff',
        customClass: {
          popup: 'swal2-popup-logros-custom'
        }
      });
    }
  });
</script>

<!-- Scripts de Logros -->
<script src="/build/js/logros.js"></script>
<script src="/build/js/logros-swiper.js"></script>