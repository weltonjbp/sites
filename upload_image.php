<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://diskwai.com.br");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$base_dir = '/home/gmapsist/diskwai/apps/quizzes/images/';

try {
    if (!isset($_FILES['image'])) {
        throw new Exception('Nenhuma imagem enviada');
    }

    $file = $_FILES['image'];
    $filename = uniqid() . '_' . $file['name'];
    $filepath = $base_dir . $filename;

    if (!is_dir($base_dir)) {
        if (!mkdir($base_dir, 0755, true)) {
            throw new Exception('Falha ao criar pasta');
        }
    }

    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        throw new Exception('Falha ao salvar imagem');
    }

    $url = "https://diskwai.com.br/apps/quizzes/images/" . $filename;

    echo json_encode([
        'success' => true,
        'url' => $url
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>