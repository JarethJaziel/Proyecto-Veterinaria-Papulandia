<?php
header('Content-Type: application/json');
ini_set('session.cookie_path', '/');
session_start();

// Verificar sesión
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}

// Cargar variables de entorno
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$db_name = $_ENV['DB_NAME'];

// Conectar a la base de datos
$conn = new mysqli($host, $user, $pass, $db_name);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}

$usuario = $_SESSION['usuario'];
$usuario_id = $usuario['id'];

$query = "
    SELECT 
        m.id AS mascota_id,
        m.nombre AS nombre_mascota,
        m.especie,
        m.raza,
        m.fecha_nacimiento,
        COALESCE(MIN(c.fecha), 'Sin asignar') AS proxima_cita
    FROM mascotas m
    LEFT JOIN citas c ON m.id = c.mascota_id
    WHERE m.usuario_id = ?
    GROUP BY m.id, m.nombre, m.especie, m.raza, m.fecha_nacimiento
    ORDER BY m.id DESC
";

$stmt = $conn->prepare($query);
$stmt->bind_param('i', $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$mascotas = [];
while ($row = $result->fetch_assoc()) {
    $mascotas[] = $row;
}

if (empty($mascotas)) {
    echo json_encode([]);
} else {
    echo json_encode($mascotas);
}

$stmt->close();
$conn->close();
?>
