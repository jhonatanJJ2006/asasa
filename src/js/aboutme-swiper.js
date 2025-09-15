// About Me Swiper - Inicialización del carrusel de imágenes
(function() {
    'use strict';

    // Función para inicializar el swiper de About Me
    function initAboutMeSwiper() {
        // Verificar si Swiper está disponible
        if (typeof Swiper === 'undefined') {
            console.error('Swiper no está cargado');
            return;
        }

        // Verificar si el elemento del swiper existe
        const swiperElement = document.querySelector('.aboutme-swiper');
        if (!swiperElement) {
            console.log('Swiper de About Me no encontrado en esta página');
            return;
        }

        // Inicializar Swiper
        const aboutMeSwiper = new Swiper('.aboutme-swiper', {
            // Configuración básica
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },
            speed: 600,
            
            // Efectos de transición
            effect: 'slide',
            
            // Configuración de slides
            slidesPerView: 1,
            spaceBetween: 20,
            centeredSlides: true,
            
            // Breakpoints responsivos
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 1,
                    spaceBetween: 30
                }
            },
            
            // Navegación
            navigation: {
                nextEl: '.aboutme-swiper-next',
                prevEl: '.aboutme-swiper-prev',
            },
            
            // Paginación
            pagination: {
                el: '.aboutme-swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            
            // Eventos
            on: {
                init: function() {
                    console.log('About Me Swiper inicializado correctamente');
                },
                slideChange: function() {
                    // Opcional: agregar efectos adicionales al cambiar slide
                }
            }
        });

        // Pausar autoplay cuando el usuario interactúa
        swiperElement.addEventListener('mouseenter', function() {
            aboutMeSwiper.autoplay.pause();
        });

        swiperElement.addEventListener('mouseleave', function() {
            aboutMeSwiper.autoplay.resume();
        });

        // Hacer el swiper globalmente accesible para debugging
        window.aboutMeSwiper = aboutMeSwiper;
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAboutMeSwiper);
    } else {
        initAboutMeSwiper();
    }

    console.log('About Me Swiper script cargado correctamente');
})();
