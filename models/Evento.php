<?php

namespace Model;

class Evento extends ActiveRecord {
    protected static $tabla = 'eventos';
    protected static $columnasDB = ['id', 'nombre', 'descripcion', 'fecha', 'hora', 'tipo_reunion', 'lugar'];

    public $id;
    public $nombre;
    public $descripcion;
    public $fecha;
    public $hora;
    public $tipo_reunion;
    public $lugar;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
        $this->tipo_reunion = $args['tipo'] ?? '';
        $this->lugar = $args['lugar'] ?? '';
    }
}
