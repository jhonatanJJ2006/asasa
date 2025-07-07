<aside class="admin__sidebar">
    <nav class="admin__menu">
        <a class="admin__enlace <?php echo pagina_actual('/admin/about') ? 'admin__enlace--actual' : '' ?>" href="/admin/about">
            <i class="admin__icono fa-solid fa-circle-info"></i>
            <span class="admin__menu-texto">Acerca De</span>
        </a>

        <a class="admin__enlace <?php echo pagina_actual('/admin/logros') ? 'admin__enlace--actual' : '' ?>" href="/admin/logros">
            <i class="admin__icono fa-solid fa-trophy"></i>
            <span class="admin__menu-texto">Logros</span>
        </a>
        
        <a class="admin__enlace <?php echo pagina_actual('/admin/propuestas') ? 'admin__enlace--actual' : '' ?>" href="/admin/propuestas">
            <i class="admin__icono fa-solid fa-lightbulb"></i>
            <span class="admin__menu-texto">Propuestas</span>
        </a>

        <a class="admin__enlace <?php echo pagina_actual('/admin/historyteling') ? 'admin__enlace--actual' : '' ?>" href="/admin/historyteling">
            <i class="admin__icono fa-solid fa-book-open"></i>
            <span class="admin__menu-texto">Historyteling</span>
        </a>
        
        <a class="admin__enlace <?php echo pagina_actual('/admin/mapa') ? 'admin__enlace--actual' : '' ?>" href="/admin/mapa">
            <i class="admin__icono fa-solid fa-map-location-dot"></i>
            <span class="admin__menu-texto">Mapa</span>
        </a>

        <a class="admin__enlace <?php echo pagina_actual('/admin/agenda') ? 'admin__enlace--actual' : '' ?>" href="/admin/agenda">
            <i class="admin__icono fa-solid fa-calendar-days"></i>
            <span class="admin__menu-texto">Agenda</span>
        </a>

    </nav>
</aside>