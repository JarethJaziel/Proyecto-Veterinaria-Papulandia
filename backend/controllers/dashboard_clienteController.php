<?php
session_start();
header('Content-Type: application/json');

// Verificar si el usuario está logueado
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['tipo'] !== 'cliente') {
    echo json_encode([
        'success' => false,
        'message' => 'Acceso no autorizado.'
    ]);
    exit;
}

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$conn = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASS'], $_ENV['DB_NAME']);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Falla de conexión a BD."]);
    exit;
}

$usuario_id = $_SESSION['usuario']['id'];

$sql = "SELECT
            m.usuario_id AS usuario_id,
            m.id AS mascota_id,
            m.nombre AS nombre,
            m.especie AS especie,
            m.raza AS raza,
            c.fecha AS proxima_cita   
        FROM mascotas m
        LEFT JOIN citas c ON c.mascota_id = m.id
        WHERE m.usuario_id = ?";

        
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$mascotas = [];
while ($row = $result->fetch_assoc()) {
    $mascotas[] = $row;
}

echo json_encode([
    'success' => true,
    'mascotas' => $mascotas
]);

$stmt->close();
$conn->close();
?>