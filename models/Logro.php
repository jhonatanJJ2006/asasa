<?php

namespace Model;

class Logro extends ActiveRecord
{
    protected static $tabla = 'logros';
    protected static $columnasDB = [
        'id',
        'fecha',
        'titulo',
        'descripcion',
        'imagen',
        'pdfs',
        'creado_en',
        'destacado'
    ];

    public $id;
    public $fecha;
    public $titulo;
    public $descripcion;
    public $imagen;
    public $pdfs;
    public $creado_en;
    public $destacado;

    public function __construct($args = [])
    {
        $this->id          = $args['id'] ?? null;
        $this->fecha       = $args['fecha'] ?? date('Y-m-d');
        $this->titulo      = $args['titulo'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->imagen      = $args['imagen'] ?? null;
        $this->pdfs        = $args['pdfs'] ?? null;
        $this->creado_en   = $args['creado_en'] ?? date('Y-m-d H:i:s');
        $this->destacado   = $args['destacado'] ?? 0;
    }
}
