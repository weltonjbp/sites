<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://diskwai.com.br");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Caminho ajustado para a estrutura do Apache
$base_dir = '/var/www/diskwai.com.br/html/apps/quizzes/';

try {
    // Validação de dados
    if (
        !isset($_POST['conteudo']) || 
        !isset($_POST['nome_arquivo']) || 
        empty($_POST['conteudo']) || 
        empty($_POST['nome_arquivo'])
    ) {
        throw new Exception('Dados incompletos');
    }

    // Sanitização de nome de arquivo
    $filename = preg_replace('/[^a-zA-Z0-9\-_\.]/', '', $_POST['nome_arquivo']);
    
    if (
        !preg_match('/^quiz_[a-zA-Z0-9\-_]+\.html$/', $filename) || 
        strlen($filename) > 64 // Limita tamanho do nome
    ) {
        throw new Exception('Nome de arquivo inválido');
    }

    // Verifica/cria diretório com permissões seguras
    if (!is_dir($base_dir)) {
        if (!mkdir($base_dir, 0755, true)) {
            throw new Exception('Falha ao criar diretório');
        }
        // Define propriedade para o Apache
        chown($base_dir, 'www-data');
        chgrp($base_dir, 'www-data');
    }

    // Valida conteúdo
    $conteudo = $_POST['conteudo'];
    if (strlen($conteudo) > 1048576) { // Limite de 1MB
        throw new Exception('Arquivo muito grande');
    }

    // Salva arquivo
    $filepath = $base_dir . $filename;
    if (file_put_contents($filepath, $conteudo) === false) {
        throw new Exception('Falha ao salvar arquivo');
    }

    // Define permissões seguras para o arquivo
    chmod($filepath, 0644);
    chown($filepath, 'www-data');
    chgrp($filepath, 'www-data');

    // Resposta de sucesso
    $url = "https://diskwai.com.br/apps/quizzes/" . $filename;
    
    echo json_encode([
        'success' => true,
        'url' => $url,
        'filename' => $filename,
        'filesize' => filesize($filepath)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'error_code' => $e->getCode()
    ]);
}
