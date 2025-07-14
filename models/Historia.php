<?php

namespace Model;

class Historia extends ActiveRecord {
    protected static $tabla = 'historias';
    protected static $columnasDB = ['id', 'titulo', 'sinopsis', 'autor', 'created_at', 'updated_at'];

    public $id;
    public $titulo;
    public $sinopsis;
    public $autor;
    public $created_at;
    public $updated_at;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->titulo = $args['titulo'] ?? '';
        $this->sinopsis = $args['sinopsis'] ?? '';
        $this->autor = $args['autor'] ?? '';
        $this->created_at = $args['created_at'] ?? date('Y-m-d H:i:s');
        $this->updated_at = $args['updated_at'] ?? date('Y-m-d H:i:s');
    }
}