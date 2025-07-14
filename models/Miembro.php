<?php

namespace Model;

class Miembro extends ActiveRecord {
    protected static $tabla = 'miembrocolectivo';
    protected static $columnasDB = ['id', 'nombre', 'imagen', 'descripcion', 'items', 'redes'];

    public $id;
    public $nombre;
    public $imagen;
    public $descripcion;
    public $items;
    public $redes;
    
    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->imagen = $args['imagen'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->items = $args['items'] ?? '';
        $this->redes = $args['redes'] ?? '';
    }
}