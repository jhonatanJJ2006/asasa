<?php

namespace Model;

class EventoMapa extends ActiveRecord {
    // Añade 'ciudad' a las columnas de la tabla
    protected static $tabla = 'mapa';
    protected static $columnasDB = ['id', 'nombre', 'ciudad', 'imagenes', 'descripcion', 'fecha', 'items'];

    public $id;
    public $nombre;
    public $ciudad;
    public $imagenes;
    public $descripcion;
    public $fecha;
    public $items;
    
    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->ciudad = $args['ciudad'] ?? '';
        $this->imagenes = $args['imagenes'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->fecha = $args['fecha'] ?? '';
        $this->items = $args['items'] ?? '';
    }
}
