<?php

namespace Controllers;

use Model\Canton;
use Model\EventoMapa;

class CaragarDatosController
{

    public static function datosMapa()
    {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $eventos = EventoMapa::all();

            echo json_encode(['response' => $eventos]);
        } else {
            echo json_encode(['response' => false, 'error' => 'Método no permitido']);
        }
    }
}
