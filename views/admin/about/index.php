<h2 class="titulo"><?php echo $titulo ?></h2>

<div class="admin__contenedor-boton">
    <a class="admin__boton" href="/admin/">
        <i class="fa-solid fa-circle-arrow-left"></i>
        Volver
    </a>
</div>

<div class="admin__contenedor">
    <?php if (!empty($about)) { ?>

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