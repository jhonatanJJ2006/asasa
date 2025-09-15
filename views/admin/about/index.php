<h2 class="titulo"><?php echo $titulo ?></h2>

<div class="admin__contenedor-boton">
    <a class="admin__boton" href="/admin/">
        <i class="fa-solid fa-circle-arrow-left"></i>
        Volver
    </a>
</div>

<div class="admin__contenedor">
    <?php if (!empty($about)) { ?>

        <table class="table">
            <thead class="table__thead">
                <tr>
                    <th class="table__th-display" scope="col">Mi Historia</th>
                    <th class="table__th table__th--ponentes" scope="col">Descripción</th>
                    <th class="table__th table__th--ponentes" scope="col">Frase</th>
                    <th class="table__th table__th--ponentes" scope="col">Número</th>
                    <th class="table__th table__th--ponentes" scope="col">Email</th>
                    <th class="table__th table__th--acciones" scope="col">Acciones</th>
                </tr>
            </thead>

            <tbody class="table__tbody">
                <?php foreach ($about as $abou) { ?>
                    <tr class="table__tr">
                        <td class="table__td table__td--descripcion">
                            <?php echo $abou->descripcion ?>
                        </td>
                        <td class="table__td">
                            <?php echo $abou->frase ?>
                        </td>
                        <td class="table__td">
                            <?php echo $abou->numero ?>
                        </td>
                        <td class="table__td">
                            <?php echo $abou->email ?>
                        </td>

                        <td class="table__td">

                            <div class="table__td--acciones">

                                <a class="table__accion table__accion--editar" href="/admin/about/editar?id=<?php echo $abou->id ?>">
                                    <i class="fa-solid fa-user-pen"></i>
                                    Editar
                                </a>

                                <div data-id="<?php echo $abou->id ?>" class="table__accion table__formulario--eliminar-about table__accion--eliminar">
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

        <div class="admin__contenedor-boton">
            <a class="admin__boton" href="/admin/about/crear">
                <i class="fa-solid fa-circle-plus"></i>
                Añadir Historia
            </a>
        </div>

        <p class="text-center">No hay Mi Historia, Crear</p>
    <?php } ?>
</div>

<?php
echo $paginacion;
?>