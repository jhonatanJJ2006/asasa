<div class="cards">
    <?php foreach ($miembros as $miembro) { ?>

        <?php

            $items = explode(",", $miembro->items);
            $redes = $miembro->redes;

            if (is_string($redes)) {
                $redes = json_decode($redes);
            }

            $facebook = $redes[0]->valor;
            $x = $redes[1]->valor;
            $youtube = $redes[2]->valor;
            $instagram = $redes[3]->valor;
            $tiktok = $redes[4]->valor;

        ?>

        <div class="tarjeta">
            <!-- Parte frontal -->
            <div class="tarjeta__face tarjeta__front">
                <img class="tarjeta__imagen" src="/build/img/miembrosColectivo/<?php echo $miembro->imagen; ?>.png" alt="<?php echo $miembro->nombre ?>">
                <div class="tarjeta__nombre"><?php echo $miembro->nombre ?></div>
            </div>

            <!-- Parte trasera -->
            <div class="tarjeta__face tarjeta__back">
                <div class="tarjeta__redes">
                    <!-- Reemplaza con los enlaces reales a redes sociales -->
                    <a href="<?php echo $facebook ?>" class="tarjeta__icono"><i class="fab fa-facebook-f"></i></a>
                    <a href="<?php echo $x ?>" class="tarjeta__icono"><i class="fab fa-twitter"></i></a>
                    <a href="<?php echo $youtube ?>" class="tarjeta__icono"><i class="fab fa-youtube"></i></a>
                    <a href="<?php echo $instagram ?>" class="tarjeta__icono"><i class="fab fa-instagram"></i></a>
                    <a href="<?php echo $tiktok ?>" class="tarjeta__icono"><i class="fab fa-tiktok"></i></a>
                </div>

                <div class="swiper items-swiper">
                    <div class="swiper-wrapper">

                        <?php foreach ($items as $item) { ?>

                            <div class="swiper-slide" style="display: flex; justify-content: center; align-items: center; height: 100%;"><?php echo $item ?></div>

                        <?php } ?>

                    </div>
                </div>

                <p class="tarjeta__descripcion">
                    <?php echo strlen($miembro->descripcion) < 1000
                        ? $miembro->descripcion
                        : substr($miembro->descripcion, 0, 1000) . '...'; ?>
                </p>
            </div>
        </div>
    <?php } ?>
</div>