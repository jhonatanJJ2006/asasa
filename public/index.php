<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\AdminController;
use MVC\Router;
use Controllers\AuthController;
use Controllers\DashboardController;

$router = new Router();


// Login
$router->get('/login', [AuthController::class, 'login']);
$router->post('/login', [AuthController::class, 'login']);
$router->post('/logout', [AuthController::class, 'logout']);

// Crear Cuenta
$router->get('/registro', [AuthController::class, 'registro']);
$router->post('/registro', [AuthController::class, 'registro']);

// Formulario de olvide mi password
$router->get('/olvide', [AuthController::class, 'olvide']);
$router->post('/olvide', [AuthController::class, 'olvide']);

// Colocar el nuevo password
$router->get('/reestablecer', [AuthController::class, 'reestablecer']);
$router->post('/reestablecer', [AuthController::class, 'reestablecer']);

// Confirmación de Cuenta
$router->get('/mensaje', [AuthController::class, 'mensaje']);
$router->get('/confirmar-cuenta', [AuthController::class, 'confirmar']);

// Dashboard
$router->get('/', [DashboardController::class, 'index']);

$router->get('/aboutme', [DashboardController::class, 'aboutMe']);

$router->get('/logros', [DashboardController::class, 'logros']);

$router->get('/propuestas', [DashboardController::class, 'propuestas']);

$router->get('/historyteling', [DashboardController::class, 'historyTeling']);

$router->get('/agenda', [DashboardController::class, 'agenda']);

$router->get('/contactame', [DashboardController::class, 'contactame']);

// Admin
$router->get('/admin', [AdminController::class, 'index']);

$router->get('/admin/about', [AdminController::class, 'about']);

$router->get('/admin/logros', [AdminController::class, 'logros']);

$router->get('/admin/propuestas', [AdminController::class, 'propuestas']);

$router->get('/admin/historyteling', [AdminController::class, 'historyteling']);

    // Mapa
$router->get('/admin/mapa', [AdminController::class, 'mapa']);
$router->get('/admin/mapa/canton', [AdminController::class, 'mapaCanton']);

$router->get('/admin/agenda', [AdminController::class, 'agenda']);

$router->comprobarRutas();