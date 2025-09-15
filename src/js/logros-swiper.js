(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const logrosSwiper = document.querySelector('.logros-swiper');
        
        if (logrosSwiper) {
            // Configuración responsive del swiper
            const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            
            new Swiper(logrosSwiper, {
                // Configuración básica
                loop: true,
                centeredSlides: true,
                
                // Autoplay
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                
                // Velocidad de transición más suave
                speed: 600,
                
                // Efecto de slide simple
                effect: 'slide',
                
                // Un slide a la vez ocupando todo el espacio
                slidesPerView: 1,
                spaceBetween: 0,
                
                // Navegación
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                
                // Paginación
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    dynamicBullets: true,
                },
                
                // Todos los breakpoints mantienen 1 slide por vista
                breakpoints: {
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    1024: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    1200: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    }
                },
                
                // Eventos
                on: {
                    init: function () {
                        // Animación inicial
                        const slides = this.slides;
                        slides.forEach((slide, index) => {
                            slide.style.opacity = '0';
                            slide.style.transform = 'translateY(50px)';
                            setTimeout(() => {
                                slide.style.transition = 'all 0.6s ease';
                                slide.style.opacity = '1';
                                slide.style.transform = 'translateY(0)';
                            }, index * 200);
                        });
                    },
                    
                    slideChange: function () {
                        // Efecto al cambiar slide
                        const activeSlide = this.slides[this.activeIndex];
                        if (activeSlide) {
                            activeSlide.style.transform = 'scale(1.02)';
                            setTimeout(() => {
                                activeSlide.style.transform = 'scale(1)';
                            }, 300);
                        }
                    }
                },
                
                // Deshabilitar arrastre/deslizamiento
                allowTouchMove: false,
                grabCursor: false,
                
                // Lazy loading para imágenes
                lazy: {
                    loadPrevNext: true,
                    loadPrevNextAmount: 2,
                },
                
                // Keyboard navigation
                keyboard: {
                    enabled: true,
                    onlyInViewport: true,
                },
                
                // Mouse wheel deshabilitado
                mousewheel: false,
            });
        }
        
        // Mejorar la experiencia en móviles
        if (vw < 768) {
            const swiperContainer = document.querySelector('.logros__swiper');
            if (swiperContainer) {
                // Prevenir scroll del body cuando se desliza el swiper
                swiperContainer.addEventListener('touchstart', function(e) {
                    e.stopPropagation();
                });
                
                swiperContainer.addEventListener('touchmove', function(e) {
                    e.stopPropagation();
                });
            }
        }
    });
})();
