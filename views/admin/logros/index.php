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
    <a class="admin__boton" href="/admin/logros/crear">
        <i class="fa-solid fa-circle-plus"></i>
        Añadir Logro
    </a>
</div>

<div class="admin__contenedor">
    <?php if (!empty($logros)) { ?>
        <table class="table">
            <thead class="table__thead">
                <tr>
                    <th class="table__th-display" scope="col">Logros</th>
                    <th class="table__th table__th--ponentes" scope="col">Imagen</th>
                    <th class="table__th table__th--ponentes" scope="col">Titulo</th>
                    <th class="table__th table__th--ponentes" scope="col">Fecha</th>
                    <th class="table__th table__th--ponentes" scope="col">Descripción</th>
                    <th class="table__th table__th--acciones" scope="col">Acciones</th>
                </tr>
            </thead>

            <tbody class="table__tbody">
                <?php foreach ($logros as $logro) { ?>
                    <tr class="table__tr">

                        <td class="table__td table__td--imagen">
                            <div class="table__imagen">
                                <picture class="table__imagen--picture">
                                    <?php
                                    $imagePath = '/build/img/logros/' . $logro->imagen;

                                    // Verifica si existe el archivo AVIF y añade la etiqueta <source> si es así
                                    if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.avif')) { ?>
                                        <source srcset="<?php echo $imagePath . '.avif'; ?>" type="image/avif">
                                    <?php }

                                    // Verifica si existe el archivo WEBP y añade la etiqueta <source> si es así
                                    if (file_exists($_SERVER['DOCUMENT_ROOT'] . $imagePath . '.webp')) { ?>
                                        <source srcset="<?php echo $imagePath . '.webp'; ?>" type="image/webp">
                                    <?php } ?>

                                    <!-- Siempre muestra la imagen PNG como fallback -->
                                    <source srcset="<?php echo $imagePath . '.png'; ?>" type="image/png">

                                    <!-- Fallback por defecto -->
                                    <img class="table__imagen--table" src="<?php echo $imagePath . '.png'; ?>" alt="Imagen Logro">
                                </picture>
                            </div>
                        </td>

                        <td class="table__td">
                            <?php echo $logro->titulo ?>
                        </td>
                        <td class="table__td table__td--fecha">
                            <?php
                            $fechaFormateada = date('d-m-Y', strtotime($logro->fecha));
                            echo $fechaFormateada;
                            ?>
                        </td>
                        <td class="table__td table__td--descripcion">
                            <?php echo $logro->descripcion ?>
                        </td>

                        <td class="table__td">

                            <div class="table__td--acciones">

                                <a class="table__accion table__accion--editar" href="/admin/logros/editar?id=<?php echo $logro->id ?>">
                                    <i class="fa-solid fa-user-pen"></i>
                                    Editar
                                </a>

                                <?php if ($logro->destacado == 0) { ?>

                                    <div data-id="<?php echo $logro->id ?>" class="table__formulario--añadir-destacados table__accion table__accion--destacados">
                                        <i class="fa-solid fa-circle-plus"></i>
                                        Añadir a destacados

                                    </div>
                                <?php } else { ?>

                                    <div data-id="<?php echo $logro->id ?>" class="table__formulario--quitar-destacados table__accion table__accion--destacados-quitar">
                                        <i class="fa-solid fa-circle-xmark"></i>
                                        Quitar de destacados
                                    </div>

                                <?php } ?>

                                <div data-id="<?php echo $logro->id ?>" class="table__formulario--eliminar-logro table__accion table__accion--eliminar">
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
        <p class="text-center">No hay Logros Aún</p>
    <?php } ?>
</div>

<?php
echo $paginacion;
?>