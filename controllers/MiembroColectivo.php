<?php

namespace Controllers;

use Intervention\Image\ImageManagerStatic as Image;
use Model\Miembro;
use MVC\Router;

class MiembroColectivo
{

    public static function index(Router $router)
    {

        $miembros = Miembro::allHistoria();

        $router->render('admin/miembrosColectivo/index', [
            'titulo' => "Miembros Colectivo",
            'miembros' => $miembros
        ]);
    }
    public static function crear(Router $router)
    {

        $router->render('admin/miembrosColectivo/crear', [
            'titulo' => "Crear Nuevo Miembro"
        ]);
    }

    public static function subirMiembroColectivo()
    {

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $nombre = $_POST['nombre'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;
            $imagen = $_FILES['imagen'] ?? null;
            $tags = $_POST['tags'] ?? null;

            if (isset($_POST['redes'])) {
                $json = $_POST['redes'];

                $redes = json_decode($json, true);

                if (json_last_error() === JSON_ERROR_NONE) {

                    $redesDb = [];

                    foreach ($redes as $red) {
                        $redesDb[] = $red['id'] . ',' . $red['valor'] . ':';
                    }

                    $redFormat = join('', $redesDb);
                    $redFormat = substr($redFormat, 0, -1);
                } else {

                    echo "Error al decodificar JSON: " . json_last_error_msg();
                }
            }

            // Procesar la imagen si fue enviada
            if (!empty($imagen['tmp_name'])) {
                $carpetaImagenes = '../public/build/img/miembrosColectivo';

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

                $_POST['imagen'] = $nombreImagen;
            }

            $miembroColectivo = new Miembro($_POST);
            $miembroColectivo->items = $tags;
            $respuesta = $miembroColectivo->guardar();

            if ($respuesta) {
                echo json_encode('success', true);
            } else {
                echo json_encode('success', false);
            }
        }
    }
    public static function editar(Router $router)
    {

        $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

        if (!$id) {
            header('Location: /admin/miembrosColectivo');
        }

        $miembro = Miembro::find($id);

        if (!$miembro) {
            header('Location: /admin/miembrosColectivo');
        }

        $redes = $miembro->redes;

        if (is_string($redes)) {
            $redes = json_decode($redes);
        }

        $facebook = $redes[0]->valor;
        $x = $redes[1]->valor;
        $youtube = $redes[2]->valor;
        $instagram = $redes[3]->valor;
        $tiktok = $redes[4]->valor;

        $router->render('admin/miembrosColectivo/editar', [
            'titulo' => "Crear Nuevo Miembro",
            'miembro' => $miembro,
            'facebook' => $facebook,
            'x' => $x,
            'youtube' => $youtube,
            'instagram' => $instagram,
            'tiktok' => $tiktok
        ]);
    }

    public static function eliminar()
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

            $miembro = Miembro::find($id);

            if ($miembro->imagen) {

                $carpeta_imagenes = '../public/build/img/miembrosColectivo';

                $imgPath = "$carpeta_imagenes/$miembro->imagen";

                if (file_exists("$imgPath.png")) {
                    unlink("$imgPath.png");
                }
                if (file_exists("$imgPath.webp")) {
                    unlink("$imgPath.webp");
                }
            }

            $respuesta = $miembro->eliminar();

            if ($respuesta) {
                echo json_encode([
                    'ok' => true,
                    'message' => 'Miembro eliminado correctamente'
                ]);
            } else {
                http_response_code(500);
                echo json_encode([
                    'ok' => false,
                    'message' => 'No se pudo eliminar el miembro'
                ]);
            }
        }
    }
}
