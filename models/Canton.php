<?php

namespace Model;

class Usuario extends ActiveRecord {
    protected static $tabla = 'canton';
    protected static $columnasDB = ['id', 'nombre', 'imagenes', 'descripcion', 'items'];

    public $id;
    public $nombre;
    public $imagenes;
    public $descripcion;
    public $items;
    
    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->imagenes = $args['imagenes'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->items = $args['items'] ?? '';
    }
}