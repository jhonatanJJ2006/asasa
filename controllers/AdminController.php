<?php

namespace Controllers;

use Model\About;
use Model\Evento;
use Model\EventoMapa;
use Model\Historia;
use Model\Logro;
use MVC\Router;
use Intervention\Image\ImageManagerStatic as Image;

class AdminController
{
    /**
     * Función de prueba para verificar rutas y permisos de imágenes
     */
    public static function testImagenes()
    {
        header('Content-Type: application/json');
        
        $carpeta_imagenes = $_SERVER['DOCUMENT_ROOT'] . '/build/img/editor/';
        $carpeta_alternativa = '../public/build/img/editor/';
        
        $resultado = [
            'document_root' => $_SERVER['DOCUMENT_ROOT'],
            'carpeta_principal' => $carpeta_imagenes,
            'carpeta_principal_existe' => file_exists($carpeta_imagenes),
            'carpeta_alternativa' => $carpeta_alternativa,
            'carpeta_alternativa_existe' => file_exists($carpeta_alternativa),
            'permisos_escritura' => is_writable($carpeta_imagenes),
            'archivos_en_carpeta' => []
        ];
        
        if (file_exists($carpeta_imagenes)) {
            $archivos = scandir($carpeta_imagenes);
            $resultado['archivos_en_carpeta'] = array_filter($archivos, function($archivo) {
                return $archivo !== '.' && $archivo !== '..';
            });
        }
        
        echo json_encode($resultado, JSON_PRETTY_PRINT);
        exit;
    }

    public static function index(Router $router)
    {

        $router->render('admin/index', [
            'titulo' => "Admin"
        ]);
    }
    public static function about(Router $router)
    {

        $router->render('admin/about/index', [
            'titulo' => "Mi Historia"
        ]);
    }
    public static function aboutCrear(Router $router)
    {

        $router->render('admin/about/crear', [
            'titulo' => "Crear"
        ]);
    }
    public static function aboutGuardar()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            header('Content-Type: application/json');

            $frase        = $_POST['frase']       ?? null;
            $descripcion  = $_POST['descripcion'] ?? null;
            $numero       = $_POST['numero']      ?? null;
            $email        = $_POST['email']       ?? null;

            $errores = [];

            // Validaciones
            if (!$frase) {
                $errores[] = "La frase es obligatoria";
            }
            if (!$numero) {
                $errores[] = "El número es obligatorio";
            }
            if (!$email) {
                $errores[] = "El email es obligatorio";
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errores[] = "El email no es válido";
            }

            // Validar CV
            if (!isset($_FILES['cv']) || $_FILES['cv']['error'] === UPLOAD_ERR_NO_FILE) {
                $errores[] = "El archivo de CV es obligatorio";
            } else {
                $cvInfo = $_FILES['cv'];
                if ($cvInfo['type'] !== 'application/pdf') {
                    $errores[] = "El CV debe ser un archivo PDF";
                }
            }

            // Validar imágenes
            if (!isset($_FILES['imagenes']) || empty($_FILES['imagenes']['tmp_name'][0])) {
                $errores[] = "Debes subir al menos una imagen";
            }

            if (!empty($errores)) {
                echo json_encode(['success' => false, 'message' => implode('<br>', $errores)]);
                exit;
            }

            // Procesar imágenes
            $imagenesNombres = [];
            $carpetaImagenes = '../public/build/img/about';
            if (!is_dir($carpetaImagenes)) {
                mkdir($carpetaImagenes, 0755, true);
            }
            foreach ($_FILES['imagenes']['tmp_name'] as $i => $tmp_name) {
                if (!empty($tmp_name)) {
                    $nombreImagen = md5(uniqid(rand(), true));
                    // Usas Intervention Image para convertir y guardar (como en tu ejemplo)
                    $imagenPng = Image::make($tmp_name)->encode('png', 80);
                    $imagenWebp = Image::make($tmp_name)->encode('webp', 80);

                    $imagenPng->save("$carpetaImagenes/$nombreImagen.png");
                    $imagenWebp->save("$carpetaImagenes/$nombreImagen.webp");

                    $imagenesNombres[] = $nombreImagen;
                }
            }
            $imagenesSerializadas = json_encode($imagenesNombres);

            // Procesar CV
            $carpetaCV = '../public/build/cv';
            if (!is_dir($carpetaCV)) {
                mkdir($carpetaCV, 0755, true);
            }
            $nombreCV = md5(uniqid(rand(), true)) . '.pdf';
            move_uploaded_file($_FILES['cv']['tmp_name'], "$carpetaCV/$nombreCV");

            $about = new About();
            $about->frase = $frase;
            $about->descripcion = $descripcion;
            $about->numero = $numero;
            $about->email = $email;
            $about->imagenes = $imagenesSerializadas;
            $about->cv = $nombreCV;


            $resultado = $about->guardar();

            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Información guardada correctamente']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al guardar en la base de datos']);
            }
        }
    }
    public static function logrosCrearDestacado()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            header('Content-Type: application/json');

            $id = $_POST['id'];

            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'ID inválido o no proporcionado']);
                exit;
            }

            $logro = Logro::find($id);

            $logro->destacado = 1;

            $resultado = $logro->guardar();

            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Logro añadido a destacados correctamente']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al añadir el logro a destacados']);
            }
        }
    }

    public static function logrosEliminarDestacado() {

        if($_SERVER["REQUEST_METHOD"] == "POST") {

            header('Content-Type: application/json');

            $id = $_POST['id'];

            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'ID inválido o no proporcionado']);
                exit;
            }

            $logro = Logro::find($id);

            $logro->destacado = 0;

            $resultado = $logro->guardar();

            if ($resultado) {
                echo json_encode(['success' => true, 'message' => 'Logro eliminado de destacados correctamente']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al eliminar el logro de destacados']);
            }

        }

    }
    public static function logros(Router $router)
    {

        $logros = Logro::allHistoria();

        $router->render('admin/logros/index', [
            'titulo' => "Logros",
            'logros' => $logros
        ]);
    }
    public static function logrosCrear(Router $router)
    {

        $router->render('admin/logros/crear', [
            'titulo' => "Nuevo Logro"
        ]);
    }
    public static function logrosEditar(Router $router)
    {

        $id = $_GET['id'];
        $id = filter_var($id, FILTER_VALIDATE_INT);

        if (!$id) {
            header('Location: /admin/logros');
        }

        $logro = Logro::find($id);

        if (!$logro) {
            header('Location: /admin/logros');
        }

        $router->render('admin/logros/editar', [
            'titulo' => "Editar Logro",
            'logro' => $logro
        ]);
    }
    public static function logrosSubir()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            // Datos principales
            $fecha = $_POST['fecha'] ?? null;
            $titulo      = $_POST['titulo'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;

            // Imagen
            $imagen = $_FILES['imagen'] ?? null;
            $nombreImagen = null;

            // PDFs
            $pdfsNombres = [];

            // ----- PROCESAR IMAGEN (redimensionar PNG y WEBP) -----
            if (!empty($imagen['tmp_name'])) {
                $carpetaImagenes = '../public/build/img/logros';

                // Crear la carpeta si no existe
                if (!is_dir($carpetaImagenes)) {
                    mkdir($carpetaImagenes, 0755, true);
                }

                $nombreImagen = md5(uniqid(rand(), true));

                // Redimensionar y codificar las imágenes PNG y WebP
                $imagenPng = Image::make($imagen['tmp_name'])->encode('png', 80);
                $imagenWebp = Image::make($imagen['tmp_name'])->encode('webp', 80);

                // Guardar las imágenes
                $imagenPng->save("$carpetaImagenes/$nombreImagen.png");
                $imagenWebp->save("$carpetaImagenes/$nombreImagen.webp");

                // Guardar solo el nombre base (sin extensión)
                $_POST['imagen'] = $nombreImagen;
            }

            // ----- PROCESAR PDFs -----
            if (isset($_FILES['pdfs']) && !empty($_FILES['pdfs']['name'][0])) {
                $carpetaPDFs = '../public/build/pdfs/logros';
                if (!is_dir($carpetaPDFs)) {
                    mkdir($carpetaPDFs, 0755, true);
                }
                foreach ($_FILES['pdfs']['tmp_name'] as $i => $tmp_name) {
                    $nombreArchivo = $_FILES['pdfs']['name'][$i];
                    $nombreUnico = md5(uniqid(rand(), true)) . '_' . preg_replace('/\s+/', '_', $nombreArchivo);
                    $destino = "$carpetaPDFs/$nombreUnico";
                    if (move_uploaded_file($tmp_name, $destino)) {
                        $pdfsNombres[] = $nombreUnico;
                    }
                }
            }

            $pdfsSerializados = !empty($pdfsNombres) ? json_encode($pdfsNombres) : null;

            // ---- GUARDAR EN LA BD USANDO MODELO ----
            $logro = new Logro([
                'fecha'       => $fecha,
                'titulo'      => $titulo,
                'descripcion' => $descripcion,
                'imagen'      => $nombreImagen ?? null, // solo el nombre base
                'pdfs'        => $pdfsSerializados
            ]);
            $respuesta = $logro->guardar();

            if ($respuesta) {
                echo json_encode('success', true);
            } else {
                echo json_encode('fail', true);
            }
        }
    }
    public static function logrosSubirEditar()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            // Datos principales
            $fecha = $_POST['fecha'] ?? null;
            $titulo      = $_POST['titulo'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;
            $id = $_POST['id'] ?? null;

            // Imagen
            $imagen = $_FILES['imagen'] ?? null;
            $nombreImagen = null;

            // PDFs
            $pdfsNombres = [];

            $logro = Logro::find($id);

            // ----- PROCESAR IMAGEN (redimensionar PNG y WEBP) -----
            if (!empty($imagen['tmp_name'])) {
                $carpetaImagenes = '../public/build/img/logros';

                // Eliminar imagen anterior si existe
                if (!empty($logro->imagen)) {
                    $imagenBase = $logro->imagen;
                    $pngPath = "$carpetaImagenes/$imagenBase.png";
                    $webpPath = "$carpetaImagenes/$imagenBase.webp";
                    if (file_exists($pngPath)) unlink($pngPath);
                    if (file_exists($webpPath)) unlink($webpPath);
                }

                // Crear la carpeta si no existe
                if (!is_dir($carpetaImagenes)) {
                    mkdir($carpetaImagenes, 0755, true);
                }

                $nombreImagen = md5(uniqid(rand(), true));

                // Redimensionar y codificar las imágenes PNG y WebP
                $imagenPng = Image::make($imagen['tmp_name'])->encode('png', 80);
                $imagenWebp = Image::make($imagen['tmp_name'])->encode('webp', 80);

                // Guardar las imágenes
                $imagenPng->save("$carpetaImagenes/$nombreImagen.png");
                $imagenWebp->save("$carpetaImagenes/$nombreImagen.webp");

                // Guardar solo el nombre base (sin extensión)
                $logro->imagen = $nombreImagen;
            }

            // ----- PROCESAR PDFs -----
            if (isset($_FILES['pdfs']) && !empty($_FILES['pdfs']['name'][0])) {
                $carpetaPDFs = '../public/build/pdfs/logros';

                // Eliminar PDFs anteriores si existen
                if (!empty($logro->pdfs)) {
                    $pdfsAnteriores = json_decode($logro->pdfs, true);
                    if (is_array($pdfsAnteriores)) {
                        foreach ($pdfsAnteriores as $pdfAnt) {
                            $pdfPath = "$carpetaPDFs/$pdfAnt";
                            if (file_exists($pdfPath)) unlink($pdfPath);
                        }
                    }
                }

                if (!is_dir($carpetaPDFs)) {
                    mkdir($carpetaPDFs, 0755, true);
                }
                foreach ($_FILES['pdfs']['tmp_name'] as $i => $tmp_name) {
                    $nombreArchivo = $_FILES['pdfs']['name'][$i];
                    $nombreUnico = md5(uniqid(rand(), true)) . '_' . preg_replace('/\s+/', '_', $nombreArchivo);
                    $destino = "$carpetaPDFs/$nombreUnico";
                    if (move_uploaded_file($tmp_name, $destino)) {
                        $pdfsNombres[] = $nombreUnico;
                    }
                }
                $logro->pdfs = !empty($pdfsNombres) ? json_encode($pdfsNombres) : null;
            }

            // Actualizar otros campos
            $logro->fecha = $fecha;
            $logro->titulo = $titulo;
            $logro->descripcion = $descripcion;

            // ---- GUARDAR EN LA BD USANDO MODELO ----
            $respuesta = $logro->guardar();

            if ($respuesta) {
                echo json_encode('success', true);
            } else {
                echo json_encode('fail', true);
            }
        }
    }

    public static function logrosEliminar()
    {

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            header('Content-Type: application/json');

            $id = $_POST['id'] ?? null;
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'message' => 'ID inválido o no proporcionado'
                ]);
                exit;
            }

            $logro = Logro::find($id);

            if ($logro->imagen) {

                $carpeta_imagenes = '../public/build/img/logros';

                $imgPath = "$carpeta_imagenes/$logro->imagen";

                if (file_exists("$imgPath.png")) {
                    unlink("$imgPath.png");
                }
                if (file_exists("$imgPath.webp")) {
                    unlink("$imgPath.webp");
                }
            }

            if ($logro->pdfs) {

                $carpetaPDFs = '../public/build/pdfs/logros';

                // Eliminar PDFs anteriores si existen
                if (!empty($logro->pdfs)) {
                    $pdfsAnteriores = json_decode($logro->pdfs, true);
                    if (is_array($pdfsAnteriores)) {
                        foreach ($pdfsAnteriores as $pdfAnt) {
                            $pdfPath = "$carpetaPDFs/$pdfAnt";
                            if (file_exists($pdfPath)) unlink($pdfPath);
                        }
                    }
                }
            }

            $respuesta = $logro->eliminar();

            if ($respuesta) {
                echo json_encode([
                    'ok' => true,
                    'message' => 'Logro eliminado correctamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'message' => 'No se pudo eliminar el logro'
                ]);
            }
        }
    }

    public static function propuestas(Router $router)
    {

        $router->render('admin/propuestas', [
            'titulo' => "Propuestas"
        ]);
    }
    public static function historyteling(Router $router)
    {

        $historias = Historia::allHistoria();

        $router->render('admin/historyteling/index', [
            'titulo' => "Historyteling",
            'historias' => $historias
        ]);
    }
    public static function historytelingCrear(Router $router)
    {

        $router->render('admin/historyteling/crear', [
            'titulo' => "Crear Historia"
        ]);
    }
    public static function historytelingCargar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            date_default_timezone_set('America/Guayaquil');
            header('Content-Type: application/json');

            try {
                // Obtener y validar datos del formulario
                $titulo = trim($_POST['titulo'] ?? '');
                $sinopsis = trim($_POST['sinopsis'] ?? ''); // Viene como HTML del editor enriquecido
                $autor = trim($_POST['autor'] ?? '');

                // Validaciones básicas
                if (empty($titulo)) {
                    throw new \Exception('El título es obligatorio');
                }

                if (empty($sinopsis)) {
                    throw new \Exception('La sinopsis es obligatoria');
                }

                if (empty($autor)) {
                    throw new \Exception('El autor es obligatorio');
                }

                // Validaciones adicionales
                if (strlen($titulo) < 3) {
                    throw new \Exception('El título debe tener al menos 3 caracteres');
                }

                if (strlen($titulo) > 200) {
                    throw new \Exception('El título no puede exceder 200 caracteres');
                }

                if (strlen($autor) < 2) {
                    throw new \Exception('El nombre del autor debe tener al menos 2 caracteres');
                }

                if (strlen($autor) > 100) {
                    throw new \Exception('El nombre del autor no puede exceder 100 caracteres');
                }

                // Validar longitud de la sinopsis (considerando que puede ser HTML)
                $sinopsisLength = strlen($sinopsis);
                if ($sinopsisLength > 65535) { // Límite para TEXT en MySQL
                    throw new \Exception('La sinopsis es demasiado larga. Por favor, reduce el contenido.');
                }

                // Sanitizar HTML de la sinopsis (permitir solo tags seguros incluyendo títulos)
                $sinopsis = strip_tags($sinopsis, '<p><br><strong><b><em><i><u><a><ul><ol><li><img><picture><source><h1><h2><h3><h4><h5><h6><blockquote><code><pre>');

                // Crear nueva historia
                $historia = new Historia([
                    'titulo' => $titulo,
                    'sinopsis' => $sinopsis,
                    'autor' => $autor,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]);

                // Intentar guardar en la base de datos
                $resultado = $historia->guardar();

                if ($resultado) {
                    echo json_encode([
                        'ok' => true,
                        'message' => 'Historia guardada correctamente',
                        'id' => $historia->id,
                        'redirect' => '/admin/historyteling'
                    ]);
                } else {
                    throw new \Exception('Error al guardar en la base de datos. Verifica la conexión.');
                }

            } catch (\Exception $e) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'message' => $e->getMessage(),
                    'error_type' => 'validation_error'
                ]);
            }
        } else {
            http_response_code(405);
            echo json_encode([
                'ok' => false,
                'message' => 'Método no permitido'
            ]);
        }
    }

    public static function historytelingEditar(Router $router)
    {

        $id = $_GET['id'] ?? null;
        $id = filter_var($id, FILTER_VALIDATE_INT);

        if (!$id) {
            header('Location: /admin/historyteling');
            exit;
        }

        $historia = Historia::find($id);

        if (!$historia) {
            header('Location: /admin/historyteling');
            exit;
        }

        $router->render('admin/historyteling/editar', [
            'titulo' => "Editar Historia",
            'historia' => $historia
        ]);
    }
    public static function historytelingEditarCargar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            date_default_timezone_set('America/Guayaquil');
            header('Content-Type: application/json');

            // Validar existencia y tipo del ID
            $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'message' => 'ID inválido o no proporcionado'
                ]);
                return;
            }

            $historia = Historia::find($id);

            if (!$historia) {
                http_response_code(404);
                echo json_encode([
                    'ok' => false,
                    'message' => 'Historia no encontrada'
                ]);
                return;
            }

            // Asignar campos
            $historia->titulo = trim($_POST['titulo'] ?? '');
            $historia->sinopsis = trim($_POST['sinopsis'] ?? '');
            $historia->autor = trim($_POST['autor'] ?? '');
            $historia->updated_at = date('Y-m-d H:i:s');

            // Sanitizar HTML de la sinopsis (permitir solo tags seguros incluyendo títulos)
            $historia->sinopsis = strip_tags($historia->sinopsis, '<p><br><strong><b><em><i><u><a><ul><ol><li><img><picture><source><h1><h2><h3><h4><h5><h6><blockquote><code><pre>');

            // Guardar y responder
            $resultado = $historia->guardar();

            if ($resultado) {
                echo json_encode([
                    'ok' => true,
                    'message' => 'Historia guardada correctamente',
                    'id' => $historia->id
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'message' => 'Error al guardar la historia'
                ]);
            }
        }
    }
    public static function historytelingEliminar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            header('Content-Type: application/json');

            $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'message' => 'ID inválido o no proporcionado'
                ]);
                exit;
            }

            $historia = Historia::find($id);

            if (!$historia) {
                header('Location: /admin/historyteling');
                exit;
            }

            $sinopsis = $historia->sinopsis;

            $carpeta_imagenes = '../public/build/img/editor/';

            preg_match_all('/<img[^>]+src=["\']([^"\']+)["\'][^>]*>/i', $sinopsis, $matches);
            if (!empty($matches[1])) {
                $imagenesEliminadas = 0;
                
                foreach ($matches[1] as $imagenUrl) {
                    // Extraer solo el nombre del archivo de la URL
                    $nombreArchivo = basename(parse_url($imagenUrl, PHP_URL_PATH));
                    $nombreSinExtension = pathinfo($nombreArchivo, PATHINFO_FILENAME);

                    if (!empty($nombreArchivo)) {
                        // Eliminar diferentes formatos de imagen
                        $formatos = ['png', 'webp'];
                        
                        foreach ($formatos as $ext) {
                            $rutaImagen = $carpeta_imagenes . $nombreSinExtension . '.' . $ext;
                            if (file_exists($rutaImagen)) {
                                if (unlink($rutaImagen)) {
                                    $imagenesEliminadas++;
                                    echo "Archivo eliminado: " . $rutaImagen . "\n";
                                }
                            }
                        }
                    }
                }
                
                echo "Total imágenes eliminadas: " . $imagenesEliminadas . "\n";
            }

            $resultado = $historia->eliminar();

            if ($resultado) {
                $mensaje = 'Historia eliminada correctamente';
                
                echo json_encode([
                    'ok' => true,
                    'message' => $mensaje
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'message' => 'No se pudo eliminar la historia'
                ]);
            }
        }
    }

    public static function mapa(Router $router)
    {

        $eventos = EventoMapa::allHistoria();

        $router->render('admin/mapa/index', [
            'titulo' => "Mapa",
            'eventos' => $eventos
        ]);
    }

    public static function mapaCrear(Router $router)
    {

        $ciudades = [
            "Quito",
            "Guayaquil",
            "Cuenca",
            "Santo Domingo",
            "Machala",
            "Durán",
            "Manta",
            "Portoviejo",
            "Loja",
            "Ambato",
            "Riobamba",
            "Esmeraldas",
            "Ibarra",
            "Quevedo",
            "Milagro",
            "Latacunga",
            "Babahoyo",
            "Tulcán",
            "Chone",
            "Santa Elena",
            "Salinas",
            "El Coca",
            "La Libertad",
            "Nueva Loja",
            "Puyo",
            "Tena",
            "Macas",
            "Zamora",
            "Guaranda",
            "Azogues",
            "Otavalo",
            "Cayambe",
            "Pelileo",
            "Pasaje",
            "Playas",
            "La Troncal",
            "Pedro Carbo",
            "Jipijapa",
            "Montecristi",
            "Yaguachi",
            "Vinces",
            "Santa Rosa",
            "Samborondón",
            "Santa Cruz (Galápagos)",
            "Puerto Ayora",
            "Puerto Baquerizo Moreno",
            "Puerto Bolívar",
            "San Lorenzo",
            "Bahía de Caráquez",
            "Alausí",
            "Guano",
            "Pedro Vicente Maldonado",
            "Shushufindi",
            "Catamayo",
            "Cañar"
        ];

        $router->render('admin/mapa/crear', [
            'titulo' => "Crear",
            'ciudades' => $ciudades
        ]);
    }
    public static function mapaEditar(Router $router)
    {

        $id = $_GET['id'];
        $id = filter_var($id, FILTER_VALIDATE_INT);

        if (!$id) {
            header('Location: /admin/mapa');
        }

        $evento = EventoMapa::find($id);

        if (!$evento) {
            header('Location: /admin/mapa');
        }

        $ciudades = [
            "Quito",
            "Guayaquil",
            "Cuenca",
            "Santo Domingo",
            "Machala",
            "Durán",
            "Manta",
            "Portoviejo",
            "Loja",
            "Ambato",
            "Riobamba",
            "Esmeraldas",
            "Ibarra",
            "Quevedo",
            "Milagro",
            "Latacunga",
            "Babahoyo",
            "Tulcán",
            "Chone",
            "Santa Elena",
            "Salinas",
            "El Coca",
            "La Libertad",
            "Nueva Loja",
            "Puyo",
            "Tena",
            "Macas",
            "Zamora",
            "Guaranda",
            "Azogues",
            "Otavalo",
            "Cayambe",
            "Pelileo",
            "Pasaje",
            "Playas",
            "La Troncal",
            "Pedro Carbo",
            "Jipijapa",
            "Montecristi",
            "Yaguachi",
            "Vinces",
            "Santa Rosa",
            "Samborondón",
            "Santa Cruz (Galápagos)",
            "Puerto Ayora",
            "Puerto Baquerizo Moreno",
            "Puerto Bolívar",
            "San Lorenzo",
            "Bahía de Caráquez",
            "Alausí",
            "Guano",
            "Pedro Vicente Maldonado",
            "Shushufindi",
            "Catamayo",
            "Cañar"
        ];

        $router->render('admin/mapa/editar', [
            'titulo' => "Editar",
            'ciudades' => $ciudades,
            'evento' => $evento
        ]);
    }
    public static function mapaSubirDatos()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            header('Content-Type: application/json');

            // === DATOS PRINCIPALES ===
            $nombre       = $_POST['nombre']       ?? null;
            $descripcion  = $_POST['descripcion']  ?? null;
            $fecha        = $_POST['fecha']        ?? null;
            $items        = $_POST['items']        ?? null;
            $ciudad        = $_POST['ciudad']        ?? null;

            // VALIDACIÓN SIMPLE
            $errores = [];
            if (!$nombre)       $errores[] = "El nombre es obligatorio";
            if (!$descripcion)  $errores[] = "La descripción es obligatoria";
            if (!$fecha)        $errores[] = "La fecha es obligatoria";

            // === PROCESAR IMÁGENES ===
            $imagenesNombres = [];
            $carpetaImagenes = '../public/build/img/mapa';
            if (!is_dir($carpetaImagenes)) {
                mkdir($carpetaImagenes, 0755, true);
            }

            if (isset($_FILES['imagenes']) && !empty($_FILES['imagenes']['tmp_name'][0])) {
                foreach ($_FILES['imagenes']['tmp_name'] as $i => $tmp_name) {
                    if (!empty($tmp_name)) {
                        // Nombre base único
                        $nombreImagen = md5(uniqid(rand(), true));

                        // Procesar y guardar PNG y WEBP
                        $imagenPng = Image::make($tmp_name)->encode('png', 80);
                        $imagenWebp = Image::make($tmp_name)->encode('webp', 80);

                        $imagenPng->save("$carpetaImagenes/$nombreImagen.png");
                        $imagenWebp->save("$carpetaImagenes/$nombreImagen.webp");

                        // Guardar solo el nombre base (sin extensión)
                        $imagenesNombres[] = $nombreImagen;
                    }
                }
            } else {
                $errores[] = "Debes subir al menos una imagen";
            }

            // Si hay errores, responder y salir
            if (!empty($errores)) {
                echo json_encode(['ok' => false, 'message' => implode('<br>', $errores)]);
                exit;
            }

            // Serializar nombres de imágenes para guardar en la BD
            $imagenesSerializadas = json_encode($imagenesNombres);

            // === GUARDADO EN BASE DE DATOS ===
            $eventoMapa = new EventoMapa([
                'nombre'      => $nombre,
                'descripcion' => $descripcion,
                'fecha'       => $fecha,
                'items'       => $items,
                'imagenes'    => $imagenesSerializadas,
                'ciudad'      => $ciudad,
            ]);

            $respuesta = $eventoMapa->guardar();

            if ($respuesta) {
                echo json_encode(['ok' => true, 'message' => 'Evento guardado correctamente']);
            } else {
                echo json_encode(['ok' => false, 'message' => 'Error al guardar el evento en la base de datos']);
            }
        }
    }
    public static function mapaEditSubir()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            header('Content-Type: application/json');

            // === DATOS PRINCIPALES ===
            $id           = $_POST['id']           ?? null;
            $nombre       = $_POST['nombre']       ?? null;
            $descripcion  = $_POST['descripcion']  ?? null;
            $fecha        = $_POST['fecha']        ?? null;
            $items        = $_POST['items']        ?? null;
            $ciudad       = $_POST['ciudad']       ?? null;

            // VALIDACIÓN SIMPLE
            $errores = [];
            if (!$id)           $errores[] = "ID inválido";
            if (!$nombre)       $errores[] = "El nombre es obligatorio";
            if (!$descripcion)  $errores[] = "La descripción es obligatoria";
            if (!$fecha)        $errores[] = "La fecha es obligatoria";

            // Buscar evento existente
            $evento = EventoMapa::find($id);
            if (!$evento) {
                $errores[] = "Evento no encontrado";
            }

            // === PROCESAR IMÁGENES ===
            $imagenesNombres = [];
            $carpetaImagenes = '../public/build/img/mapa';
            if (!is_dir($carpetaImagenes)) {
                mkdir($carpetaImagenes, 0755, true);
            }

            $imagenesAnteriores = [];
            if ($evento && $evento->imagenes) {
                $imagenesAnteriores = json_decode($evento->imagenes, true) ?: [];
            }

            $hayNuevasImagenes = (isset($_FILES['imagenes']) && !empty($_FILES['imagenes']['tmp_name'][0]));

            if ($hayNuevasImagenes) {
                // Eliminar imágenes anteriores (todas variantes)
                $formatos = ['png', 'webp', 'avif', 'jpg', 'jpeg'];
                foreach ($imagenesAnteriores as $imgAnterior) {
                    foreach ($formatos as $ext) {
                        $imgPath = "$carpetaImagenes/$imgAnterior.$ext";
                        if (file_exists($imgPath)) {
                            unlink($imgPath);
                        }
                    }
                }
                // Procesar nuevas imágenes
                foreach ($_FILES['imagenes']['tmp_name'] as $i => $tmp_name) {
                    if (!empty($tmp_name)) {
                        $nombreImagen = md5(uniqid(rand(), true));
                        $imagenPng = Image::make($tmp_name)->encode('png', 80);
                        $imagenWebp = Image::make($tmp_name)->encode('webp', 80);
                        $imagenPng->save("$carpetaImagenes/$nombreImagen.png");
                        $imagenWebp->save("$carpetaImagenes/$nombreImagen.webp");
                        $imagenesNombres[] = $nombreImagen;
                    }
                }
            } else {
                // Si no se suben nuevas imágenes, se mantienen las existentes
                $imagenesNombres = $imagenesAnteriores;
            }

            // Si no hay imágenes, error (por seguridad)
            if (empty($imagenesNombres)) {
                $errores[] = "Debes subir al menos una imagen";
            }

            // Si hay errores, responder y salir
            if (!empty($errores)) {
                echo json_encode(['ok' => false, 'message' => implode('<br>', $errores)]);
                exit;
            }

            // Serializar nombres de imágenes para guardar en la BD
            $imagenesSerializadas = json_encode($imagenesNombres);

            // === GUARDADO EN BASE DE DATOS ===
            $evento->nombre      = $nombre;
            $evento->descripcion = $descripcion;
            $evento->fecha       = $fecha;
            $evento->items       = $items;
            $evento->imagenes    = $imagenesSerializadas;
            $evento->ciudad      = $ciudad;

            $respuesta = $evento->guardar();

            if ($respuesta) {
                echo json_encode(['ok' => true, 'message' => 'Evento actualizado correctamente']);
            } else {
                echo json_encode(['ok' => false, 'message' => 'Error al actualizar el evento en la base de datos']);
            }
        }
    }
    public static function mapaEliminar()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            header('Content-Type: application/json');

            $id = $_POST['id'] ?? null;
            $id = filter_var($id, FILTER_VALIDATE_INT);

            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'message' => 'ID inválido o no proporcionado'
                ]);
                exit;
            }

            $evento = EventoMapa::find($id);

            // Elimina todas las imágenes asociadas (array json)
            if ($evento && $evento->imagenes) {
                $carpeta_imagenes = '../public/build/img/mapa';
                $formatos = ['png', 'webp', 'avif', 'jpg', 'jpeg'];

                // Decodifica las imágenes del campo JSON
                $imagenes = json_decode($evento->imagenes, true);
                if (is_array($imagenes)) {
                    foreach ($imagenes as $img) {
                        foreach ($formatos as $ext) {
                            $imgPath = "$carpeta_imagenes/$img.$ext";
                            if (file_exists($imgPath)) {
                                unlink($imgPath);
                            }
                        }
                    }
                }
            }

            $respuesta = $evento->eliminar();

            if ($respuesta) {
                echo json_encode([
                    'ok' => true,
                    'message' => 'Evento eliminado correctamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'message' => 'No se pudo eliminar el evento'
                ]);
            }
        }
    }
    public static function agenda(Router $router)
    {

        $eventos = Evento::all();

        $router->render('admin/agenda/index', [
            'titulo' => "Agenda",
            'eventos' => $eventos
        ]);
    }
    public static function agendaCrear(Router $router)
    {

        $router->render('admin/agenda/crear', [
            'titulo' => "Crear Evento"
        ]);
    }
    public static function agendaCargar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $evento = new Evento($_POST);
            $respuesta = $evento->guardar();

            if ($respuesta) {
                echo json_encode(true);
            } else {
                echo json_encode(false);
            }
        }
    }
    public static function agendaEditar(Router $router)
    {

        $id = $_GET['id'] ?? null;
        $id = filter_var($id, FILTER_VALIDATE_INT);

        if (!$id) {
            header('Location: /admin/agenda');
            exit;
        }

        $evento = Evento::find($id);

        if (!$evento) {
            header('Location: /admin/agenda');
            exit;
        }

        $router->render('admin/agenda/editar', [
            'titulo' => "Editar Evento",
            'evento' => $evento
        ]);
    }
    public static function agendaEditarCargar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            date_default_timezone_set('America/Guayaquil');
            header('Content-Type: application/json');

            // Validar existencia y tipo del ID
            $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'message' => 'ID inválido o no proporcionado'
                ]);
                return;
            }

            $evento = Evento::find($id);

            if (!$evento) {
                http_response_code(404);
                echo json_encode([
                    'ok' => false,
                    'message' => 'Evento no encontrada'
                ]);
                return;
            }

            // Asignar campos
            $evento->nombre = $_POST['nombre'];
            $evento->descripcion = $_POST['descripcion'];
            $evento->fecha = $_POST['fecha'];
            $evento->hora = $_POST['hora'];
            $evento->tipo_reunion = $_POST['tipo_reunion'];
            $evento->lugar = $_POST['lugar'];

            // Guardar y responder
            $resultado = $evento->guardar();

            if ($resultado) {
                echo json_encode([
                    'ok' => true,
                    'message' => 'Evento actualizado correctamente',
                    'id' => $evento->id
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'message' => 'Error al guardar el evento'
                ]);
            }
        }
    }
    public static function agendaEliminar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            header('Content-Type: application/json');

            $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);

            if (!$id) {
                http_response_code(400);
                echo json_encode([
                    'ok' => false,
                    'message' => 'ID inválido o no proporcionado'
                ]);
                exit;
            }

            $evento = Evento::find($id);

            if (!$evento) {
                http_response_code(404);
                echo json_encode([
                    'ok' => false,
                    'message' => 'evento no encontrada'
                ]);
                exit;
            }

            $resultado = $evento->eliminar();

            if ($resultado) {
                echo json_encode([
                    'ok' => true,
                    'message' => 'evento eliminado correctamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'message' => 'No se pudo eliminar el evento'
                ]);
            }
        }
    }

    // Endpoint para subir imágenes del editor
    public static function uploadImage()
    {
        header('Content-Type: application/json');
        
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            return;
        }

        try {
            // Verificar que se envió una imagen
            if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
                throw new \Exception('No se recibió ninguna imagen válida');
            }

            $imagen = $_FILES['image'];
            
            // Validar tipo de archivo
            $tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
            if (!in_array($imagen['type'], $tiposPermitidos)) {
                throw new \Exception('Tipo de archivo no permitido. Solo se aceptan: JPG, PNG, WEBP, AVIF');
            }

            // Validar tamaño (máximo 5MB)
            $tamañoMaximo = 5 * 1024 * 1024; // 5MB
            if ($imagen['size'] > $tamañoMaximo) {
                throw new \Exception('El archivo es demasiado grande. Máximo 5MB permitido');
            }

            // Crear carpeta si no existe
            $carpetaImagenes = '../public/build/img/historias';
            if (!is_dir($carpetaImagenes)) {
                mkdir($carpetaImagenes, 0755, true);
            }

            // Generar nombre único
            $nombreImagen = md5(uniqid(rand(), true));
            
            // Procesar y guardar imagen usando Intervention Image
            $imagenPng = Image::make($imagen['tmp_name'])->encode('png', 90);
            $imagenWebp = Image::make($imagen['tmp_name'])->encode('webp', 90);

            // Redimensionar si es muy grande (máximo 1200px de ancho)
            if ($imagenPng->width() > 1200) {
                $imagenPng->resize(1200, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $imagenWebp->resize(1200, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            }

            // Guardar las imágenes
            $imagenPng->save("$carpetaImagenes/$nombreImagen.png");
            $imagenWebp->save("$carpetaImagenes/$nombreImagen.webp");

            // Construir URLs públicas
            $urlPng = "/build/img/historias/$nombreImagen.png";
            $urlWebp = "/build/img/historias/$nombreImagen.webp";

            echo json_encode([
                'success' => true,
                'message' => 'Imagen subida correctamente',
                'data' => [
                    'filename' => $nombreImagen,
                    'url_png' => $urlPng,
                    'url_webp' => $urlWebp,
                    'size' => $imagen['size'],
                    'type' => $imagen['type']
                ]
            ]);

        } catch (\Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
