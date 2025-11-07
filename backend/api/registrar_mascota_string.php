<?php
ini_set('session.cookie_path', '/');
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$db_name = $_ENV['DB_NAME'];

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error interno del servidor: Falla de conexión a la BD."]);
    exit;
}

// Verificar que haya sesión activa
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Sesión no iniciada."]);
    exit;
}

$usuario_id = $_SESSION['usuario']['id']; // ← ID del usuario autenticado

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $nombre = $_POST['nombre'] ?? '';
    $especie = $_POST['especie'] ?? '';
    $raza = $_POST['raza'] ?? '';
    $fecha_nacimiento = $_POST['fecha_nacimiento'] ?? '';

    // Validar datos
    if (empty($nombre) || empty($especie) || empty($raza) || empty($fecha_nacimiento)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Por favor rellene los campos obligatorios."]);
        exit;
    }

    $sql = "INSERT INTO mascotas (usuario_id, nombre, especie, raza, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issss", $usuario_id, $nombre, $especie, $raza, $fecha_nacimiento);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Mascota registrada correctamente."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error al registrar la mascota."]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}

$conn->close();
?>
