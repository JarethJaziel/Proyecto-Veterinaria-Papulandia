<?php
ini_set('session.cookie_path', '/');
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['auth' => false]);
    exit;
}

echo json_encode([
    'auth' => true,
    'usuario' => $_SESSION['usuario']
]);
?>
