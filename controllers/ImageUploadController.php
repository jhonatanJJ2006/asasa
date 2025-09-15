<?php

namespace Controllers;

use Intervention\Image\ImageManagerStatic as Image;

class ImageUploadController {
    
    public static function upload() {
        // Verificar que sea una petición POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            return;
        }

        // Verificar que se haya enviado un archivo
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => 'No se ha enviado ningún archivo válido']);
            return;
        }

        $file = $_FILES['file'];
        
        // Validar tipo de archivo
        $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, GIF y WebP']);
            return;
        }

        // Validar tamaño (máximo 5MB)
        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file['size'] > $maxSize) {
            http_response_code(400);
            echo json_encode(['error' => 'El archivo es demasiado grande. Tamaño máximo: 5MB']);
            return;
        }

        try {
            // Crear directorio si no existe
            $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/build/img/editor/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            // Generar nombre único para el archivo
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $fileName = uniqid('editor_') . '.' . $extension;
            $filePath = $uploadDir . $fileName;

            // Procesar la imagen con Intervention Image
            $image = Image::make($file['tmp_name']);
            
            // Redimensionar si es muy grande (máximo 1200px de ancho)
            if ($image->width() > 1200) {
                $image->resize(1200, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }

            // Optimizar calidad
            $image->save($filePath, 85);

            // Crear versión WebP para mejor rendimiento
            $webpPath = $uploadDir . pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
            $image->save($webpPath, 85, 'webp');

            // URL pública de la imagen
            $imageUrl = '/build/img/editor/' . $fileName;
            $webpUrl = '/build/img/editor/' . pathinfo($fileName, PATHINFO_FILENAME) . '.webp';

            // Respuesta exitosa
            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'location' => $imageUrl,
                'webp' => $webpUrl,
                'size' => filesize($filePath),
                'dimensions' => [
                    'width' => $image->width(),
                    'height' => $image->height()
                ]
            ]);

        } catch (Exception $e) {
            error_log("Error al subir imagen: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor al procesar la imagen']);
        }
    }

    public static function delete() {
        // Verificar que sea una petición DELETE
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
            return;
        }

        // Obtener datos JSON
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['filename'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Nombre de archivo requerido']);
            return;
        }

        $filename = basename($input['filename']); // Seguridad: solo nombre de archivo
        $filePath = $_SERVER['DOCUMENT_ROOT'] . '/build/img/editor/' . $filename;
        $webpPath = $_SERVER['DOCUMENT_ROOT'] . '/build/img/editor/' . pathinfo($filename, PATHINFO_FILENAME) . '.webp';

        try {
            $deleted = false;
            
            // Eliminar archivo original
            if (file_exists($filePath)) {
                unlink($filePath);
                $deleted = true;
            }
            
            // Eliminar versión WebP
            if (file_exists($webpPath)) {
                unlink($webpPath);
                $deleted = true;
            }

            if ($deleted) {
                http_response_code(200);
                echo json_encode(['success' => 'Imagen eliminada correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Archivo no encontrado']);
            }

        } catch (Exception $e) {
            error_log("Error al eliminar imagen: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor']);
        }
    }
}
