<?php

namespace Controllers;

use Model\Historia;
use Model\Logro;
use Model\Miembro;
use MVC\Router;

class DashboardController
{

    public static function index(Router $router)
    {

        $miembros = Miembro::all();

        $router->render('dashboard/index', [
            'titulo' => "Dashboard",
            'miembros' => $miembros
        ]);
    }

    public static function aboutMe(Router $router)
    {

        $router->render('dashboard/aboutMe', [
            'titulo' => "Acerca De"
        ]);
    }

    public static function logros(Router $router)
    {

        $router->render('dashboard/logros', [
            'titulo' => "Logros para Loja"
        ]);
    }
    public static function getLogros()
    {
        // Permite solicitudes CORS (si tu API es pública/front)
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: application/json; charset=UTF-8');

        // Solo responder a GET
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            exit;
        }

        // Obtener todos los logros
        $logros = Logro::all();

        $resultado = [];

        foreach ($logros as $logro) {
            // Decodificar PDFs si viene como JSON (puede ser null o string)
            $pdfs = null;
            if (!empty($logro->pdfs)) {
                $pdfs = json_decode($logro->pdfs, true);
                // Si falla decode y es un string simple, lo metemos en array
                if (json_last_error() !== JSON_ERROR_NONE) {
                    $pdfs = [$logro->pdfs];
                }
            }

            $resultado[] = [
                'id'          => $logro->id,
                'fecha'       => $logro->fecha,
                'titulo'      => $logro->titulo,
                'descripcion' => $logro->descripcion,
                'imagen'      => $logro->imagen,
                'pdfs'        => $pdfs,
                'creado_en'   => $logro->creado_en
            ];
        }

        echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
    }
    public static function historyTeling(Router $router)
    {
        $historias = Historia::all();

        $router->render('dashboard/historyTeling', [
            'titulo' => "History Teling",
            'historias' => $historias
        ]);
    }
    public static function propuestas(Router $router)
    {

        $router->render('dashboard/propuestas', [
            'titulo' => "Propuestas"
        ]);
    }
    public static function agenda(Router $router)
    {

        $router->render('dashboard/agenda', [
            'titulo' => "Agenda"
        ]);
    }

    public static function contactame(Router $router)
    {
        $router->render('dashboard/contactame', [
            'titulo' => "Contactame"
        ]);
    }
    public static function crowfunding(Router $router)
    {
        $router->render('dashboard/crowfunding', [
            'titulo' => "Crowfunding"
        ]);
    }
}
