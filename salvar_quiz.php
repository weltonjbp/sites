<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://diskwai.com.br");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$base_dir = '/home/gmapsist/diskwai/apps/quizzes/';

try {
    if (!isset($_POST['conteudo'], $_POST['nome_arquivo'])) {
        throw new Exception('Dados incompletos');
    }

    $filename = preg_replace('/[^a-zA-Z0-9\-_\.]/', '', $_POST['nome_arquivo']);
    if (!preg_match('/^quiz_[\w]+\.html$/', $filename)) {
        throw new Exception('Nome de arquivo inv¨¢lido'); // Encoding corrigido
    }

    if (!is_dir($base_dir)) {
        if (!mkdir($base_dir, 0755, true)) {
            throw new Exception('Falha ao criar pasta');
        }
    }

    $filepath = $base_dir . $filename;
    $bytes = file_put_contents($filepath, $_POST['conteudo']);
    
    if ($bytes === false) {
        throw new Exception('Falha ao salvar arquivo');
    }

    $url = "https://diskwai.com.br/apps/quizzes/" . $filename;
    
    echo json_encode([
        'success' => true,
        'url' => $url
    ]);

} catch (Exception $e) { // Sintaxe corrigida
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}