<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\AdminController;
use MVC\Router;
use Controllers\AuthController;
use Controllers\CaragarDatosController;
use Controllers\DashboardController;
use Controllers\MiembroColectivo;

$router = new Router();

// =====================================================================================
// Auth
// =====================================================================================
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



// =====================================================================================
// Api
// =====================================================================================
$router->get('/api/logros', [DashboardController::class, 'getLogros']);


// =====================================================================================
// Dashboard
// =====================================================================================
$router->get('/', [DashboardController::class, 'index']);

$router->get('/aboutme', [DashboardController::class, 'aboutMe']);

$router->get('/logros', [DashboardController::class, 'logros']);

$router->get('/propuestas', [DashboardController::class, 'propuestas']);

$router->get('/historyteling', [DashboardController::class, 'historyTeling']);

$router->get('/agenda', [DashboardController::class, 'agenda']);

$router->get('/contactame', [DashboardController::class, 'contactame']);

$router->get('/crowfunding', [DashboardController::class, 'crowfunding']);


// =====================================================================================
// Admin
// =====================================================================================
$router->get('/admin', [AdminController::class, 'index']);

$router->get('/admin/about', [AdminController::class, 'about']);

    // Miembros Colectivo
$router->get('/admin/miembrosColectivo', [MiembroColectivo::class, 'index']);
$router->get('/admin/miembrosColectivo/crear', [MiembroColectivo::class, 'crear']);
$router->post('/admin/miembrosColectivo/crear/subirMiembro', [MiembroColectivo::class, 'subirMiembroColectivo']);

$router->get('/admin/miembrosColectivo/editar', [MiembroColectivo::class, 'editar']);

    // Logros
$router->get('/admin/logros', [AdminController::class, 'logros']);
$router->get('/admin/logros/crear', [AdminController::class, 'logrosCrear']);
$router->post('/admin/logros/crear/subirLogro', [AdminController::class, 'logrosSubir']);

    // Propuestas
$router->get('/admin/propuestas', [AdminController::class, 'propuestas']);

    // History Teling
$router->get('/admin/historyteling', [AdminController::class, 'historyTeling']);

$router->get('/admin/historyteling/crear', [AdminController::class, 'historytelingCrear']);
$router->post('/admin/historyteling/crear/cargar', [AdminController::class, 'historytelingCargar']);

$router->get('/admin/historyteling/editar', [AdminController::class, 'historytelingEditar']);
$router->post('/admin/historyteling/editar/cargar', [AdminController::class, 'historytelingEditarCargar']);

$router->post('/admin/historyteling/eliminar', [AdminController::class, 'historytelingEliminar']);

    // Mapa
$router->get('/admin/mapa', [AdminController::class, 'mapa']);
$router->get('/admin/mapa/canton', [AdminController::class, 'mapaCanton']);

    // Agenda
$router->get('/admin/agenda', [AdminController::class, 'agenda']);
$router->get('/admin/agenda/crear', [AdminController::class, 'agendaCrear']);
$router->post('/admin/agenda/crear/cargar', [AdminController::class, 'agendaCargar']);

$router->get('/admin/agenda/editar', [AdminController::class, 'agendaEditar']);
$router->post('/admin/agenda/editar/cargar', [AdminController::class, 'agendaEditarCargar']);

$router->post('/admin/agenda/eliminar', [AdminController::class, 'agendaEliminar']);

// =====================================================================================
// Cargar Datos
// =====================================================================================

    // Mapa
$router->post('/cargarDatos/mapa', [CaragarDatosController::class, 'datosMapa']);

$router->comprobarRutas();