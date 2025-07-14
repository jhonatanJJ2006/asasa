<?php

namespace Controllers;

use Model\Evento;
use Model\Historia;
use Model\Parrafo;
use MVC\Router;
use Intervention\Image\ImageManagerStatic as Image;

class AdminController
{

    public static function index(Router $router)
    {

        $router->render('admin/index', [
            'titulo' => "Admin"
        ]);
    }
    public static function about(Router $router)
    {

        $router->render('admin/about', [
            'titulo' => "Acerca De"
        ]);
    }
    public static function logros(Router $router)
    {

        $router->render('admin/logros/index', [
            'titulo' => "Logros"
        ]);
    }
    public static function logrosCrear(Router $router)
    {

        $router->render('admin/logros/crear', [
            'titulo' => "Nuevo Logro"
        ]);
    }
    public static function logrosSubir()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            // Datos principales
            $fecha       = $_POST['fecha'] ?? null;
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
                $imagenPng = \Intervention\Image\ImageManagerStatic::make($imagen['tmp_name'])->encode('png', 80);
                $imagenWebp = \Intervention\Image\ImageManagerStatic::make($imagen['tmp_name'])->encode('webp', 80);

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
            $logro = new \Model\Logro([
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

            $titulo = $_POST['titulo'] ?? null;
            $sinopsis = $_POST['sinopsis'] ?? null; // Viene como HTML desde Quill
            $autor = $_POST['autor'] ?? null;

            if (!$titulo || !$sinopsis || !$autor) {
                http_response_code(400);
                echo json_encode(['ok' => false, 'message' => 'Todos los campos son obligatorios']);
                return;
            }

            $historia = new Historia([
                'titulo' => $titulo,
                'sinopsis' => $sinopsis,
                'autor' => $autor
            ]);

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
            $historia->titulo = $_POST['titulo'] ?? '';
            $historia->sinopsis = $_POST['sinopsis'] ?? '';
            $historia->autor = $_POST['autor'] ?? '';
            $historia->updated_at = date('Y-m-d H:i:s');

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
                http_response_code(404);
                echo json_encode([
                    'ok' => false,
                    'message' => 'Historia no encontrada'
                ]);
                exit;
            }

            $resultado = $historia->eliminar();

            if ($resultado) {
                echo json_encode([
                    'ok' => true,
                    'message' => 'Historia eliminada correctamente'
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

        $router->render('admin/mapa/index', [
            'titulo' => "Mapa de Cantones"
        ]);
    }
    public static function mapaCanton(Router $router)
    {

        $canton = $_GET['canton'];

        $router->render('admin/mapa/mapaCanton', [
            'titulo' => $canton
        ]);
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

            $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

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
}
