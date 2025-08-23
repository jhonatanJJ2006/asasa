<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function pagina_actual($path) {
    $url_actual = strtok($_SERVER['REQUEST_URI'], '?') ?? '/';
    return $url_actual === $path;
}

function is_admin() : bool {
    session_start();
    return isset($_SESSION['admin']) && !empty($_SESSION['admin']);
}

function is_auth() {
    session_start();
    return $_SESSION['id'];
}