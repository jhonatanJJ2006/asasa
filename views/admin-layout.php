<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logo - <?php echo $titulo; ?></title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;700&family=Open+Sans:wght@400;700&display=swap" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="/build/css/app.css">

    <!-- Quill CSS -->
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
</head>

<body class="admin">

    <?php include_once __DIR__ . '/templates/admin/admin-header.php'; ?>

    <div class="admin__grid">
        <?php include_once __DIR__ . '/templates/admin/admin-sidebar.php'; ?>

        <main class="admin__contenido">
            <?php echo $contenido; ?>
        </main>
    </div>

    <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/build/js/quill.js"></script>
    <script src="/build/js/bundle.min.js" defer></script>

</body>
</html>
