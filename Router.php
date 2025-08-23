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

        // Debug: mostrar la URL actual
        // echo "URL actual: " . $url_actual . "<br>";
        // echo "Método: " . $method . "<br>";

        if ($method === 'GET') {
            $fn = $this->getRoutes[$url_actual] ?? null;
        } else {
            $fn = $this->postRoutes[$url_actual] ?? null;
        }

        if ($fn) {
            call_user_func($fn, $this);
        } else {
            http_response_code(404);
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

        // Debug: mostrar qué layout se está usando
        // echo "Layout para URL: " . $url_actual . "<br>";

        switch (true) {
            case $url_actual === '/admin' || strpos($url_actual, '/admin/') === 0:
                include_once __DIR__ . '/views/admin-layout.php';
                break;

            case $url_actual === '/aboutme' || 
                 $url_actual === '/logros' || 
                 $url_actual === '/propuestas' || 
                 $url_actual === '/historyteling' || 
                 $url_actual === '/agenda' ||
                 $url_actual === '/contactame' ||
                 $url_actual === '/crowfunding' ||
                 $url_actual === '/jessenia-maria':
                include_once __DIR__ . '/views/layout.php';
                break;

            default:
                include_once __DIR__ . '/views/dashboard-layout.php';
                break;
        }
    }
}
