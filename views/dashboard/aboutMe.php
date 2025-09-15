<div class="hero-section" style="position: relative;">
    <div class="swiper-container-portada" id="background-video">
        <div class="swiper-wrapper">
            <div class="swiper-slide">
                <picture>
                    <!-- Cambia las rutas a donde guardes tus archivos -->
                    <source srcset="/build/img/1.avif" type="image/avif">
                    <source srcset="/build/img/1.webp" type="image/webp">
                    <img src="/build/img/1.png" alt="Construcción de puente solidario" loading="lazy" />
                </picture>
            </div>
            <div class="swiper-slide">
                <picture>
                    <!-- Cambia las rutas a donde guardes tus archivos -->
                    <source srcset="/build/img/2.avif" type="image/avif">
                    <source srcset="/build/img/2.webp" type="image/webp">
                    <img src="/build/img/2.png" alt="Construcción de puente solidario" loading="lazy" />
                </picture>
            </div>
            <div class="swiper-slide">
                <picture>
                    <!-- Cambia las rutas a donde guardes tus archivos -->
                    <source srcset="/build/img/3.avif" type="image/avif">
                    <source srcset="/build/img/3.webp" type="image/webp">
                    <img src="/build/img/3.png" alt="Construcción de puente solidario" loading="lazy" />
                </picture>
            </div>
        </div>
    </div>

    <!-- Overlay oscuro -->
    <div style="
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.45);
        z-index: 1;
        pointer-events: none;
    "></div>

    <div class="hero-content" style="position: relative; z-index: 2;">
        <p>HOLA!</p>
        <h1>YO SOY <span>RAUL AUQUILLA</span></h1>
        <a class="tagline" href="/historyteling">
            <p>Descubre Su Historia</p>
        </a>
        <a href="/contactame" class="btn-hire-us">Contáctame</a>
    </div>
</div>

<div class="aboutme">
    <h1 class="titulo"><?php echo $titulo ?></h1>

    <div class="aboutme__frase"><?php echo $about->frase ?></div>

    <div class="aboutme__contenedor">

        <div class="aboutme__modulos">

            <?php if($logros) { ?>

                <div class="aboutme__modulos--modulo">
    
                    <div class="aboutme__modulos--modulo-titulo">Logros</div>
    
                    <div class="aboutme__modulos--modulo-flex">

                        <?php foreach($logros as $logro) { ?>

                            <div class="aboutme__modulos--modulo-item">
                                <span class="aboutme__modulos--modulo-viñeta">•</span>
                                <strong class="aboutme__modulos--modulo-nombre"><?php echo $logro->titulo ?></strong>
                                <span class="aboutme__modulos--modulo-fecha"><?php echo $logro->fecha ?></span>
                            </div>

                        <?php } ?>
    
                    </div>
    
                </div>

            <?php } ?>

            <?php if($propuestas) { ?>

                <div class="aboutme__modulos--modulo">
    
                    <div class="aboutme__modulos--modulo-titulo">Propuestas</div>
    
                    <div class="aboutme__modulos--modulo-flex">

                        <?php foreach($propuestas as $propuesta) { ?>

                            <div class="aboutme__modulos--modulo-item">
                                <span class="aboutme__modulos--modulo-viñeta">•</span>
                                <strong class="aboutme__modulos--modulo-nombre"><?php echo $propuesta->titulo ?></strong>
                                <span class="aboutme__modulos--modulo-fecha"><?php echo $propuesta->fecha ?></span>
                            </div>

                        <?php } ?>
    
                    </div>
    
                </div>

            <?php } ?>

            <?php if($contar) { ?>

                <div class="aboutme__modulos--modulo">
    
                    <div class="aboutme__modulos--modulo-titulo">Para Contar</div>
    
                    <div class="aboutme__modulos--modulo-flex">

                        <?php foreach($contar as $conta) { ?>

                            <div class="aboutme__modulos--modulo-item">
                                <span class="aboutme__modulos--modulo-viñeta">•</span>
                                <strong class="aboutme__modulos--modulo-nombre"><?php echo $conta->titulo ?></strong>
                                <span class="aboutme__modulos--modulo-fecha"><?php echo $conta->updated_at ?></span>
                            </div>

                        <?php } ?>
    
                    </div>
    
                </div>

            <?php } ?>

            <?php if($agenda) { ?>

                <div class="aboutme__modulos--modulo">
    
                    <div class="aboutme__modulos--modulo-titulo">Agenda</div>
    
                    <div class="aboutme__modulos--modulo-flex">

                        <?php foreach($agenda as $agen) { ?>

                            <div class="aboutme__modulos--modulo-item">
                                <span class="aboutme__modulos--modulo-viñeta">•</span>
                                <strong class="aboutme__modulos--modulo-nombre"><?php echo $agen->nombre ?></strong>
                                <span class="aboutme__modulos--modulo-fecha"><?php echo $agen->fecha ?></span>
                            </div>

                        <?php } ?>
    
                    </div>
    
                </div>

            <?php } ?>

        </div>

        <section class="aboutme__section acerca">

            <div class="aboutme__imagen">
                <!-- Swiper -->
                <div class="swiper aboutme-swiper">
                    <div class="swiper-wrapper">
                        <?php if(!empty($imagenes)) { ?>
                            <?php foreach($imagenes as $imagen) { ?>
                                <div class="swiper-slide">
                                    <img src="/build/img/about/<?php echo $imagen ?>.png" alt="Construcción de puente solidario" loading="lazy" />
                                </div>
                            <?php } ?>
                        <?php } else { ?>
                            <div class="swiper-slide">
                                <img src="/build/img/1.png" alt="Construcción de puente solidario" loading="lazy" />
                            </div>
                        <?php } ?>
                    </div>
                    
                    <!-- Navigation buttons -->
                    <div class="swiper-button-next aboutme-swiper-next"></div>
                    <div class="swiper-button-prev aboutme-swiper-prev"></div>
                    
                    <!-- Pagination -->
                    <div class="swiper-pagination aboutme-swiper-pagination"></div>
                </div>
            </div>

            <div class="acerca__contenido">
                <h2 class="acerca__titulo">Hola, Yo Soy <span class="acerca__titulo--span">Raúl Auquilla</span></h2>

                <div class="acerca__grupo">
                    <div class="acerca__descripcion">
                        <?php echo $about->descripcion ?>
                    </div>
                </div>

                <div class="acerca__caracteristicas">

                    <div class="acerca__caracteristicas--caracteristica">Nombre: <span class="acerca__caracteristicas--caracteristica-info">Raúl</span></div>
                    <div class="acerca__caracteristicas--caracteristica">Número de Teléfono: <span class="acerca__caracteristicas--caracteristica-info"><?php echo $about->numero ?></span></div>
                    <div class="acerca__caracteristicas--caracteristica">Email: <span class="acerca__caracteristicas--caracteristica-info"><?php echo $about->email ?></span></div>

                </div>

                <a href="/build/cv/<?php echo $about->cv ?>" download class="acerca__boton">
                    <i class="fa-solid fa-file"></i> Descargar CV
                </a>

            </div>
        </section>

        <div class="aboutme__modulos-2">

            <div class="aboutme__modulos--modulo">

                <div class="aboutme__modulos--modulo-titulo">Logros</div>

                <div class="aboutme__modulos--modulo-flex">

                    <?php if($logros) { ?>
                        <?php foreach($logros as $logro) { ?>
                            <div class="aboutme__modulos--modulo-item">
                                <span class="aboutme__modulos--modulo-viñeta">•</span>
                                <strong class="aboutme__modulos--modulo-nombre"><?php echo $logro->titulo ?></strong>
                                <span class="aboutme__modulos--modulo-fecha"><?php echo $logro->fecha ?></span>
                            </div>
                        <?php } ?>
                    <?php } else { ?>
                        <div class="aboutme__modulos--modulo-item">
                            <span class="aboutme__modulos--modulo-viñeta">•</span>
                            <strong class="aboutme__modulos--modulo-nombre">No hay logros disponibles</strong>
                            <span class="aboutme__modulos--modulo-fecha">--</span>
                        </div>
                    <?php } ?>

                </div>













                </div>

            </div>

            <div class="aboutme__modulos--modulo">

                <div class="aboutme__modulos--modulo-titulo">Propuestas</div>

                <div class="aboutme__modulos--modulo-flex">



                </div>

            </div>

            <div class="aboutme__modulos--modulo">

                <div class="aboutme__modulos--modulo-titulo">Para Contar</div>

                <div class="aboutme__modulos--modulo-flex">



                </div>

            </div>

            <div class="aboutme__modulos--modulo">

                <div class="aboutme__modulos--modulo-titulo">Agenda</div>

                <div class="aboutme__modulos--modulo-flex">



                </div>

            </div>

        </div>

    </div>

</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.swiper-container-portada', {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 12,
                pagination: {
                    el: '.swiper-pagination',
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

<script src="/build/js/aboutme-swiper.js"></script>