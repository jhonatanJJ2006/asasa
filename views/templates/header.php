<header id="mainHeader" class="header">
  <h1 class="header__titulo"><a href="/">Logo</a></h1>
  
  <nav>
    <ul class="header__nav">
      <li class="header__nav--item <?php echo pagina_actual("/aboutme") ? "header__nav--item-activo" : ""; ?>"><a href="/aboutme">Mi Historia</a></li>
      <li class="header__nav--item <?php echo pagina_actual("/logros") ? "header__nav--item-activo" : ""; ?>"><a href="/logros">Logros</a></li>
      <li class="header__nav--item <?php echo pagina_actual("/historyteling") ? "header__nav--item-activo" : ""; ?>"><a href="/historyteling">Para Contar</a></li>
      <li class="header__nav--item <?php echo pagina_actual("/agenda") ? "header__nav--item-activo" : ""; ?>"><a href="/agenda">Agenda</a></li>
      <li class="header__nav--item <?php echo pagina_actual("/jessenia-maria") ? "header__nav--item-activo" : ""; ?>"><a href="/jessenia-maria">Jessenia Maria</a></li>
    </ul>
  </nav>

  <div class="header__redes">
    <a href="https://api.whatsapp.com/send?phone=593985930530" class="header__redes--red header__redes--whatsapp" target="_blank">
      <i class="fa-brands fa-whatsapp"></i>
    </a>
    <a href="https://t.me/jeffersonparedes" class="header__redes--red header__redes--telegram" target="_blank">
      <i class="fa-brands fa-telegram"></i>
    </a>
    <a href="tel:+593985930530" class="header__redes--red header__redes--phone">
      <i class="fa-solid fa-phone"></i>
    </a>
    <a href="https://www.facebook.com/det.enterprise" class="header__redes--red header__redes--facebook" target="_blank">
      <i class="fa-brands fa-facebook-f"></i>
    </a>
    <a href="https://www.linkedin.com/company/det_enterprise/" class="header__redes--red header__redes--linkedin" target="_blank">
      <i class="fa-brands fa-linkedin-in"></i>
    </a>
  </div>

  <div class="header__menu"><i class="fa-solid fa-bars"></i></div>
  <div class="overlay"></div>
</header>

<nav class="header__nav--2">
  <h1 class="header__nav--2__title">Menú</h1>
  <ul>
    <li><a href="/aboutme">Mi Historia</a></li>
    <li><a href="/logros">Logros</a></li>
    <li><a href="/historyteling">Para Contar</a></li>
    <li><a href="/agenda">Agenda</a></li>
    <li><a href="/jessenia-maria">Jessenia Maria</a></li>
    <li><a href="/admin">Admin</a></li>
  </ul>

  <div class="header__redes header__redes--sidebar">
    <a href="https://api.whatsapp.com/send?phone=593985930530" target="_blank" class="header__redes--red header__redes--whatsapp">
      <i class="fa-brands fa-whatsapp"></i>
    </a>
    <a href="https://t.me/jeffersonparedes" target="_blank" class="header__redes--red header__redes--telegram">
      <i class="fa-brands fa-telegram"></i>
    </a>
    <a href="tel:+593985930530" class="header__redes--red header__redes--phone">
      <i class="fa-solid fa-phone"></i>
    </a>
    <a href="https://www.facebook.com/det.enterprise" target="_blank" class="header__redes--red header__redes--facebook">
      <i class="fa-brands fa-facebook-f"></i>
    </a>
    <a href="https://www.linkedin.com/company/det_enterprise/" target="_blank" class="header__redes--red header__redes--linkedin">
      <i class="fa-brands fa-linkedin-in"></i>
    </a>
  </div>
</nav>
