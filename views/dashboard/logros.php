<section class="logros" id="logros">
  <div class="logros__contenedor">
    <h2 class="logros__titulo">Logros para Loja y el País</h2>
    <div class="logros__timeline-container">
      <div class="logros__indicacion">
        Desliza horizontalmente o arrastra con el mouse para moverte en la línea de tiempo.<br>
        Usa la rueda del mouse o haz gesto de pellizco (pinch) para hacer zoom y ver detalles.<br>
        • Al hacer scroll hacia arriba sobre un periodo, lo expandes para ver más detalle (años → meses → días).<br>
        • Al hacer scroll hacia abajo, regresas a una vista más general (días → meses → años).
      </div>
      <div class="logros__timeline" id="timeline"></div>

      <!-- Modal (relleno por JS dinámicamente) -->
      <div class="logros__modal" id="logrosModal" style="display:none;">
        <div class="logros__modal-content" id="logrosModalContent">
          <div class="logro-modal__flex">
            <div class="logro-modal__img-wrap">
              <img src="" alt="Logro" />
            </div>
            <div class="logro-modal__info">
              <h3>Título del logro</h3>
              <span class="logro__fecha">2024-07-14</span>
              <div class="logro__desc">Descripción del logro...</div>
              <ul class="pdf-list">
                <li><a href="/build/pdfs/logros/ejemplo.pdf" target="_blank">PDF 1</a></li>
              </ul>
            </div>
          </div>
          <button class="logros__modal-close" id="logrosModalClose" aria-label="Cerrar">&times;</button>
        </div>
      </div>
      <div class="logros__line"></div>
    </div>
    <div class="logros__fecha-actual" id="fechaActual"></div>
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