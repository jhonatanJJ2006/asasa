<div class="hero-section">
    <div class="swiper-container-portada" id="background-video">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <img src="/build/img/1.png" alt="Imagen 1" />
            </div>
            <div class="swiper-slide">
                <img src="/build/img/2.png" alt="Imagen 2" />
            </div>
            <div class="swiper-slide">
                <img src="/build/img/3.png" alt="Imagen 3" />
            </div>
        </div>
        <!-- Paginación -->
        <div class="swiper-pagination"></div>
    </div>

    <header id="mainHeader" class="header-dashboard">
        <h1 class="header-dashboard__titulo"><a href="/">Logo</a></h1>
        <nav>
            <ul class="header-dashboard__nav">
                <li class="header-dashboard__nav--item"><a href="/aboutme">Mi Historia</a></li>
                <li class="header-dashboard__nav--item"><a href="logros">Logros</a></li>
                <li class="header-dashboard__nav--item"><a href="historyteling">Para Contar</a></li>
                <li class="header-dashboard__nav--item"><a href="jessenia-maria">Jessenia Maria</a></li>
                <li class="header-dashboard__nav--item"><a href="agenda">Agenda</a></li>
            </ul>
        </nav>

        <div class="header-dashboard__redes">
            <a href="https://api.whatsapp.com/send?phone=593985930530" class="header-dashboard__redes--red header-dashboard__redes--whatsapp" target="_blank">
                <i class="fa-brands fa-whatsapp"></i>
            </a>
            <a href="https://t.me/jeffersonparedes" class="header-dashboard__redes--red header-dashboard__redes--telegram" target="_blank">
                <i class="fa-brands fa-telegram"></i>
            </a>
            <a href="tel:+593985930530" class="header-dashboard__redes--red header-dashboard__redes--phone">
                <i class="fa-solid fa-phone"></i>
            </a>
            <a href="https://www.facebook.com/det.enterprise" class="header-dashboard__redes--red header-dashboard__redes--facebook" target="_blank">
                <i class="fa-brands fa-facebook-f"></i>
            </a>
            <a href="https://www.linkedin.com/company/det_enterprise/" class="header-dashboard__redes--red header-dashboard__redes--linkedin" target="_blank">
                <i class="fa-brands fa-linkedin-in"></i>
            </a>
        </div>
        <div class="header-dashboard__menu"><i class="fa-solid fa-bars"></i></div>
        <div class="overlay"></div>
    </header>

    <div class="hero-content">
        <p>HELLO!</p>
        <h1>I AM <span>RAUL AUQUILLA</span></h1>
        <a class="tagline" href="/historyteling">
            <p>Descubre Su Historia</p>
        </a>
        <a href="/contactame" class="btn-hire-us">Contáctame</a>
    </div>
</div>
<nav class="header__nav--2">
    <h1 class="header__nav--2__title">Menú</h1>
    <ul>
        <li><a href="/aboutme">Mi Historia</a></li>
        <li><a href="logros">Logros</a></li>
        <li><a href="historyteling">Para Contar</a></li>
        <li><a href="jessenia-maria">Jessenia Maria</a></li>
        <li><a href="agenda">Agenda</a></li>
        <li><a href="/admin">Admin</a></li>
    </ul>

    <div class="header-dashboard__redes header-dashboard__redes--sidebar">
        <a href="https://api.whatsapp.com/send?phone=593985930530" target="_blank" class="header-dashboard__redes--red header-dashboard__redes--whatsapp">
            <i class="fa-brands fa-whatsapp"></i>
        </a>
        <a href="https://t.me/jeffersonparedes" target="_blank" class="header-dashboard__redes--red header-dashboard__redes--telegram">
            <i class="fa-brands fa-telegram"></i>
        </a>
        <a href="tel:+593985930530" class="header-dashboard__redes--red header-dashboard__redes--phone">
            <i class="fa-solid fa-phone"></i>
        </a>
        <a href="https://www.facebook.com/det.enterprise" target="_blank" class="header-dashboard__redes--red header-dashboard__redes--facebook">
            <i class="fa-brands fa-facebook-f"></i>
        </a>
        <a href="https://www.linkedin.com/company/det_enterprise/" target="_blank" class="header-dashboard__redes--red header-dashboard__redes--linkedin">
            <i class="fa-brands fa-linkedin-in"></i>
        </a>
    </div>
</nav>


<script>
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.swiper-container-portada', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 12,
                pagination: {
                    el: '.swiper-container-portada .swiper-pagination',
                    clickable: true,
                },
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                }
            });
        }
    });
</script>