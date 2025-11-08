<?php

ini_set('session.cookie_path', '/');
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Falla de conexión a BD."]);
    exit;
}

// --- Incluir Clases ---
require_once __DIR__ . '/../model/Usuario.php';
require_once __DIR__ . '/../controllers/UsuariosController.php';
require_once __DIR__ . '/../model/Mascota.php';         
require_once __DIR__ . '/../controllers/MascotasController.php';

// --- Creación de "Servicios" ---
$modeloUsuario = new Usuario($conn);
$controladorUsuario = new UsuariosController($modeloUsuario);

$modeloMascota = new Mascota($conn); 
$controladorMascota = new MascotasController($modeloMascota);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $controladorUsuario->login();
        break;
    
    case 'register_user':
        $controladorUsuario->register();
        break;

    case 'register_pet':
        $controladorMascota->crear();
        break;

    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Acción no válida."]);
        break;
}

$conn->close();
?>