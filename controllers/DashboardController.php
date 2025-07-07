<?php

namespace Controllers;

use MVC\Router;

class DashboardController
{

    public static function index(Router $router)
    {
        $router->render('dashboard/index', [
            'titulo' => "Dashboard"
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
    public static function historyTeling(Router $router)
    {

        $router->render('dashboard/historyTeling', [
            'titulo' => "History Teling"
        ]);
    }

    public static function propuestas(Router $router)
    {

        $router->render('dashboard/propuestas', [
            'titulo' => "Propuestas"
        ]);
    }

    public static function contactame(Router $router)
    {
        $router->render('dashboard/contactame', [
            'titulo' => "Contactame"
        ]);
    }
}
