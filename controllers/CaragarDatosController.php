<?php

namespace Controllers;

class CaragarDatosController
{

    public static function datosMapa()
    {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            

            echo json_encode(['response' => true]);
        } else {
            echo json_encode(['response' => false, 'error' => 'Método no permitido']);
        }
    }
}
