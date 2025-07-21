<div class="aboutme">
    <h1 class="aboutme__titulo"><?php echo $titulo ?></h1>

    <section class="aboutme__section acerca">
        <div class="acerca__contenido">
            <h2 class="acerca__titulo">Trayectoria Histórica</h2>

            <div class="acerca__grupo">
                <div class="trayectoria">
                    <div class="trayectoria__item">
                        <h3 class="trayectoria__subtitulo">Datos Personales</h3>
                        <p>
                            1952 (8 de septiembre): Nace Raúl Vicente Auquilla Ortega en Sígsig, provincia de Azuay, Ecuador.<br />
                            Se cría en la ciudad de Loja, donde cursó sus estudios secundarios en el Seminario Menor San José y el Colegio La Salle.
                        </p>
                    </div>

                    <div class="trayectoria__item">
                        <h3 class="trayectoria__subtitulo">Currículum Vitae</h3>
                        <ul class="trayectoria__lista">
                            <li class="trayectoria__pdf">
                                <a href="pdfs/CVs UNIDER Raúl Auquilla.pdf" target="_blank" class="trayectoria__enlace">
                                    📄 Descargar CV completo
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Nueva sección para ver el PDF embebido -->
            <section class="pdf-viewer">
                <h3 class="pdf-viewer__title">Visualizador de CV</h3>
                <div class="pdf-viewer__container">
                    <iframe
                        src="/build/img/pdf/CVs UNIDER Raúl Auquilla.pdf"
                        class="pdf-viewer__iframe"
                        frameborder="0"
                        scrolling="auto"
                        aria-label="Visualizador del CV de Raúl Auquilla"></iframe>
                </div>
            </section>
        </div>
    </section>
</div>