<h2 class="titulo"><?php echo $titulo ?></h2>

<div class="admin__contenedor-boton">
    <a class="admin__boton" href="/admin/">
        <i class="fa-solid fa-circle-arrow-left"></i>
        Volver
    </a>
</div>

<div class="search-header search-header__admin">
    <input id="buscador" placeholder="Search" class="search-header__input search-header__input--admin" type="text" />
    <button id="btnBuscador" class="search-header__button">
        <svg
            fill="none"
            viewBox="0 0 18 18"
            height="18"
            width="18"
            class="search-header__icon--admin">
            <path
                fill="#0B0C10"
                d="M7.132 0C3.197 0 0 3.124 0 6.97c0 3.844 3.197 6.969 7.132 6.969 1.557 0 2.995-.49 4.169-1.32L16.82 18 18 16.847l-5.454-5.342a6.846 6.846 0 0 0 1.718-4.536C14.264 3.124 11.067 0 7.132 0zm0 .82c3.48 0 6.293 2.748 6.293 6.15 0 3.4-2.813 6.149-6.293 6.149S.839 10.37.839 6.969C.839 3.568 3.651.82 7.132.82z"></path>
        </svg>
    </button>
</div>

<div class="admin__contenedor-boton">
    <a class="admin__boton" href="/admin/mapa/crear">
        <i class="fa-solid fa-circle-plus"></i>
        Añadir Evento Mapa
    </a>
</div>

<div class="admin__contenedor">
    <?php if (!empty($eventos)) { ?>
        <table class="table">
            <thead class="table__thead">
                <tr>
                    <th class="table__th-display" scope="col">Mapa</th>
                    <th class="table__th table__th--imagenes" scope="col">Imágenes</th>
                    <th class="table__th table__th--titulo" scope="col">Título</th>
                    <th class="table__th table__th--titulo" scope="col">Ciudad</th>
                    <th class="table__th table__th--fecha" scope="col">Fecha</th>
                    <th class="table__th table__th--descripcion" scope="col">Descripción</th>
                    <th class="table__th table__th--acciones" scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody class="table__tbody">
                <?php foreach ($eventos as $evento) { ?>
                    <tr class="table__tr">

                        <td class="table__td table__td--imagen">
                            <div class="table__imagen">
                                <?php
                                $imagenes = json_decode($evento->imagenes, true);
                                if (is_array($imagenes) && count($imagenes) > 1) { ?>
                                    <!-- Swiper para múltiples imágenes -->
                                    <div class="swiper imagenes-swiper imagenes-swiper-<?php echo $evento->id; ?>">
                                        <div class="swiper-wrapper">
                                            <?php foreach ($imagenes as $img) { ?>
                                                <div class="swiper-slide">
                                                    <picture class="table__imagen--picture">
                                                        <?php
                                                        $imagePath = '/build/img/mapa/' . $img;
                                                        if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.avif')) { ?>
                                                            <source srcset="<?php echo $imagePath . '.avif'; ?>" type="image/avif">
                                                        <?php }
                                                        if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.webp')) { ?>
                                                            <source srcset="<?php echo $imagePath . '.webp'; ?>" type="image/webp">
                                                        <?php } ?>
                                                        <source srcset="<?php echo $imagePath . '.png'; ?>" type="image/png">
                                                        <img class="table__imagen--table" src="<?php echo $imagePath . '.png'; ?>" alt="Imagen Mapa">
                                                    </picture>
                                                </div>
                                            <?php } ?>
                                        </div>
                                        <div class="swiper-pagination"></div>
                                    </div>
                                <?php } elseif (is_array($imagenes) && count($imagenes) === 1) {
                                    $img = $imagenes[0];
                                    $imagePath = '/build/img/mapa/' . $img;
                                ?>
                                    <picture class="table__imagen--picture">
                                        <?php if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.avif')) { ?>
                                            <source srcset="<?php echo $imagePath . '.avif'; ?>" type="image/avif">
                                        <?php }
                                        if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.webp')) { ?>
                                            <source srcset="<?php echo $imagePath . '.webp'; ?>" type="image/webp">
                                        <?php } ?>
                                        <source srcset="<?php echo $imagePath . '.png'; ?>" type="image/png">
                                        <img class="table__imagen--table" src="<?php echo $imagePath . '.png'; ?>" alt="Imagen Mapa">
                                    </picture>
                                <?php } ?>
                            </div>
                        </td>

                        <td class="table__td"><?php echo $evento->nombre ?></td>

                        <td class="table__td"><?php echo $evento->ciudad ?></td>

                        <td class="table__td table__td--fecha">
                            <?php
                            $fechaFormateada = date('d-m-Y', strtotime($evento->fecha));
                            echo $fechaFormateada;
                            ?>
                        </td>

                        <td class="table__td table__td--descripcion">
                            <?php echo $evento->descripcion ?>
                        </td>

                        <td class="table__td">
                            <div class="table__td--acciones">
                                <a class="table__accion table__accion--editar" href="/admin/mapa/editar?id=<?php echo $evento->id ?>">
                                    <i class="fa-solid fa-user-pen"></i>
                                    Editar
                                </a>
                                <div data-id="<?php echo $evento->id ?>" class="table__accion table__formulario--eliminar-mapa table__accion--eliminar">
                                    <i class="fa-solid fa-circle-xmark"></i>
                                    Eliminar
                                </div>
                            </div>
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    <?php } else { ?>
        <p class="text-center">No hay Eventos Aún</p>
    <?php } ?>
</div>

<?php
echo $paginacion;
?>

<!-- Swiper JS (asegúrate de tener este script en tu HTML principal) -->
<script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const swiperElements = document.querySelectorAll('.imagenes-swiper');
        if (!swiperElements.length || typeof Swiper === 'undefined') return;

        swiperElements.forEach(swiperEl => {
            const paginationEl = swiperEl.querySelector('.swiper-pagination');
            if (!paginationEl) return;
            new Swiper(swiperEl, {
                loop: true,
                slidesPerView: 1,
                spaceBetween: 8,
                pagination: {
                    el: paginationEl,
                    clickable: true,
                },
            });
        });
    });
</script>