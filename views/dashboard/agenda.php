<div class="agenda">

  <h1 class="titulo">Calendario Mensual</h1>

  <div class="calendario-mensual">
    <!-- Navegación del mes -->
    <div class="calendario-header">
      <button id="mes-anterior">&#10094;</button>
      <h2 id="mes-actual"></h2>
      <button id="mes-siguiente">&#10095;</button>
    </div>

    <!-- Grid de calendario con días y encabezados -->
    <div class="calendario-grid">
      <div class="dia-encabezado">Dom</div>
      <div class="dia-encabezado">Lun</div>
      <div class="dia-encabezado">Mar</div>
      <div class="dia-encabezado">Mié</div>
      <div class="dia-encabezado">Jue</div>
      <div class="dia-encabezado">Vie</div>
      <div class="dia-encabezado">Sáb</div>
      <!-- Días dinámicos se insertan aquí desde JS -->
    </div>

    <!-- Sección que muestra eventos en móvil -->
    <div class="calendario-eventos" id="eventos-del-dia">
      <h3>Eventos del día</h3>
      <ul class="lista-eventos">
        <li>Selecciona un día para ver los eventos</li>
      </ul>
    </div>
  </div>

  <!-- Sección de Crowdfunding -->
  <section class="crowdfunding">
    <div class="crowdfunding__container">
      <div class="crowdfunding__img-wrap">
        <picture>
          <!-- Cambia las rutas a donde guardes tus archivos -->
          <source srcset="/build/img/crowfonding/puente.avif" type="image/avif">
          <source srcset="/build/img/crowfonding/puente.webp" type="image/webp">
          <img src="/build/img/crowfonding/puente.png" alt="Construcción de puente solidario" loading="lazy" />
        </picture>
      </div>
      <div class="crowdfunding__info">
        <h3 class="crowdfunding__title">¡Ayúdanos a construir un puente para todos!</h3>
        <p class="crowdfunding__desc">
          Con tu donación, podemos mejorar la conectividad y la vida de decenas de familias en la comunidad.<br>
          ¡Tu apoyo hace posible grandes cambios!
        </p>
        <a class="crowdfunding__donate-btn"
          href="https://www.paypal.com/donate"
          target="_blank" rel="noopener">
          <i class="fa-brands fa-paypal"></i> Ayudar con una donación
        </a>
      </div>
    </div>
  </section>

</div>