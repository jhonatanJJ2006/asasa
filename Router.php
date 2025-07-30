<?php

namespace MVC;

class Router
{
    public array $getRoutes = [];
    public array $postRoutes = [];

    public function get($url, $fn)
    {
        $this->getRoutes[$url] = $fn;
    }

    public function post($url, $fn)
    {
        $this->postRoutes[$url] = $fn;
    }

    public function comprobarRutas()
    {

        $url_actual = strtok($_SERVER['REQUEST_URI'], '?') ?? '/';
        $method = $_SERVER['REQUEST_METHOD'];

        if ($method === 'GET') {
            $fn = $this->getRoutes[$url_actual] ?? null;
        } else {
            $fn = $this->postRoutes[$url_actual] ?? null;
        }

        if ($fn) {
            call_user_func($fn, $this);
        } else {
            echo "Página No Encontrada o Ruta no válida";
        }
    }
    public function render($view, $datos = [])
    {
        foreach ($datos as $key => $value) {
            $$key = $value;
        }

        ob_start();

        include_once __DIR__ . "/views/$view.php";

        $contenido = ob_get_clean(); // Limpia el Buffer

        // Utilizar el layout de acuerdo a la URL
        $url_actual = strtok($_SERVER['REQUEST_URI'], '?') ?? '/';

        switch (true) {

            case str_contains($url_actual, '/admin'):
                include_once __DIR__ . '/views/admin-layout.php';
                break;

            case str_contains($url_actual, '/aboutme'):
            case str_contains($url_actual, '/logros'):
            case str_contains($url_actual, '/propuestas'):
            case str_contains($url_actual, '/historyteling'):
            case str_contains($url_actual, '/agenda'):
            case str_contains($url_actual, '/contactame'):
                include_once __DIR__ . '/views/layout.php';
                break;

            default:
                include_once __DIR__ . '/views/dashboard-layout.php';
                break;
        }
    }
}
