<?php

namespace Controllers;

use Model\About;
use Model\Evento;
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

        $about = About::get(1);

        $logros = Logro::getAtributos('titulo, fecha', 'logros');
        $contar = Historia::getAtributos('titulo, updated_at', 'historias');
        $agenda = Evento::getAtributos('nombre, fecha', 'eventos');
        $propuestas = []; // Array vacío por ahora, se puede implementar un modelo específico después


        // Convertir el string de imágenes en un array
        $imagenesArray = [];
        if (!empty($about[0]->imagenes)) {
            // Intentar decodificar como JSON
            $imagenesDecoded = json_decode($about[0]->imagenes, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($imagenesDecoded)) {
                $imagenesArray = $imagenesDecoded;
            } else {
                // Si no es JSON válido, tratar como string separado por comas
                $imagenesArray = array_filter(array_map('trim', explode(',', $about[0]->imagenes)));
            }
        }

        $router->render('dashboard/aboutMe', [
            'titulo' => "Mi Historia",
            'about' => $about[0],
            'imagenes' => $imagenesArray,
            'logros' => $logros,
            'contar' => $contar,
            'agenda' => $agenda,
            'propuestas' => $propuestas
        ]);
    }

    public static function logros(Router $router)
    {

        $logrosDestacados = Logro::where('destacado', 1);

        $router->render('dashboard/logros', [
            'titulo' => "Logros para Loja",
            'logrosDestacados' => $logrosDestacados
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
    public static function getEventos()
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

        // Obtener todos los eventos
        $eventos = Evento::all();

        echo json_encode($eventos, JSON_UNESCAPED_UNICODE);
    }
    public static function historyTeling(Router $router)
    {
        $historias = Historia::all();

        $router->render('dashboard/historyTeling', [
            'titulo' => "Para Contar Antes de Olvidar",
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

    public static function jesseniaMaria(Router $router) {

        $router->render("dashboard/jesseniaMaria", [
            "titulo" => "Jessenia Maria"
        ]);

    }
}
