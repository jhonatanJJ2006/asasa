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
