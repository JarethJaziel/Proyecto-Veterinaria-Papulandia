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
require_once __DIR__ . '/../model/User.php';
require_once __DIR__ . '/../controllers/UsersController.php';

require_once __DIR__ . '/../model/Pet.php';         
require_once __DIR__ . '/../controllers/PetsController.php';

require_once __DIR__ . '/../model/Date.php';         
require_once __DIR__ . '/../controllers/DatesController.php';

require_once __DIR__ . '/../controllers/AdminDashboardController.php';
require_once __DIR__ . '/../controllers/ClientDashboardController.php';
require_once __DIR__ . '/../controllers/AdminDashboardController.php';
// --- Creación de "Servicios" ---
$modeloUsuario = new User($conn);
$controladorUsuario = new UsersController($modeloUsuario);

$modeloMascota = new Pet($conn); 
$controladorMascota = new PetsController($modeloMascota);

$modeloCita = new Date($conn); 
$controladorCita = new DatesController($modeloCita);

$controladorAdminDashboard = new AdminDashboardController($modeloMascota, $modeloUsuario, $modeloCita);
$controladorClientDashboard = new ClientDashboardController($modeloMascota, $modeloCita);
$controladorAdminDashboard = new AdminDashboardController($modeloMascota, $modeloUsuario, $modeloCita);

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        $controladorUsuario->login();
        break;
    
    case 'register_user':
        $controladorUsuario->register();
        break;

    case 'register_pet':
        $controladorMascota->create();
        break;

    case 'register_cita':
        $controladorCita->create();
        break;  

    case 'update_user':
        $controladorUsuario->updateUser();
        break;
        
    case 'get_client_pets':
        $controladorClientDashboard->getClienteDashboard();
        break;

    case 'get_admin_stats':
        $controladorAdminDashboard->getStats();
        break;

    case 'get_all_clients':
        $controladorUsuario->getAllClients();
        break;

    case 'get_all_users':
        $controladorUsuario->getAllUsers();
        break;

    case 'switch_user_type':
        $controladorUsuario->switchUserType();
        break;

        case 'delete_user':
        $controladorUsuario->deleteUser();
        break;

    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Acción no válida."]);
        break;
}

$conn->close();
?>