<?php

namespace Controllers;

use MVC\Router;

class AdminController {

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

        $router->render('admin/logros', [
            'titulo' => "Logros"
        ]);

    }
    public static function propuestas(Router $router)
    {

        $router->render('admin/propuestas', [
            'titulo' => "Propuestas"
        ]);

    }
    public static function historyteling(Router $router)
    {

        $router->render('admin/historyteling', [
            'titulo' => "Historyteling"
        ]);

    }
    public static function mapa(Router $router)
    {

        $router->render('admin/mapa', [
            'titulo' => "Mapa de Cantones"
        ]);

    }
    public static function mapaCanton(Router $router)
    {

        $canton = $_GET['canton'];

        $router->render('admin/mapaCanton', [
            'titulo' => $canton
        ]);

    }
    public static function agenda(Router $router)
    {

        $router->render('admin/agenda', [
            'titulo' => "Agenda"
        ]);

    }

}