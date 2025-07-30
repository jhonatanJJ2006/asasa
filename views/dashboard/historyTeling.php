<div class="historia__contenedor2">

    <h1 class="titulo"><?php echo $titulo ?></h1>
    
    <?php foreach ($historias as $historia): ?>
        <section class="historia">
            <div class="historia__contenedor">
    
                <div class="historia__fecha--contenedor">
    
                    <div class="historia__fecha">
                        Inicio: <?php echo date('d \d\e F Y', strtotime($historia->created_at)); ?>
                    </div>
        
                    <?php if (!empty($historia->updated_at) && $historia->updated_at !== $historia->created_at): ?>
                        <div class="historia__fecha">
                            Última actualización: <?php echo date('d \d\e F Y', strtotime($historia->updated_at)); ?>
                        </div>
                    <?php endif; ?>
    
                </div>
    
                <h2 class="historia__titulo">
                    <?php echo htmlspecialchars($historia->titulo); ?>
                </h2>
    
                <div class="historia__texto">
                    <?php echo $historia->sinopsis;?>
                </div>
    
                <p class="historia__autor">
                    <strong>Autor:</strong> <?php echo htmlspecialchars($historia->autor); ?>
                </p>
            </div>
        </section>
    <?php endforeach; ?>
    
</div>

