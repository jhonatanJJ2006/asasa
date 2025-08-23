<?php

namespace Model;

class About extends ActiveRecord {
    protected static $tabla = 'about';  // Cambia por el nombre real de la tabla en tu BD
    protected static $columnasDB = ['id', 'frase', 'descripcion', 'numero', 'email', 'imagenes', 'cv'];

    public $id;
    public $frase;
    public $descripcion;
    public $numero;
    public $email;
    public $imagenes; // Aquí guardaremos el JSON con los nombres de las imágenes
    public $cv;       // Nombre del archivo PDF

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->frase = $args['frase'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->numero = $args['numero'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->imagenes = $args['imagenes'] ?? '';
        $this->cv = $args['cv'] ?? '';
    }
}
