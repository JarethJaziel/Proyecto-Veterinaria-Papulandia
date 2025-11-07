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
    http_response_code(500); // Internal Server Error
    echo json_encode([
        "success" => false, 
        "message" => "Error interno del servidor: Falla de conexión a la BD."
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['email'] ?? '';
    $contrasena_form = $_POST['contrasena'] ?? '';

    if (empty($correo) || empty($contrasena_form)) {
        http_response_code(400); 
        echo json_encode(["success" => false, "message" => "Correo o contraseña vacíos."]);
        $conn->close();
        exit; 
    }

    $sqlQuery = "SELECT id, nombre, apellidos, correo, contrasena, tipo FROM usuarios WHERE correo = ?";
    $stmt = $conn->prepare($sqlQuery);

    if ($stmt === false) {
         http_response_code(500);
         echo json_encode(["success" => false, "message" => "Error interno del servidor: Falla en la consulta."]);
         $conn->close();
         exit;
    }

    $stmt->bind_param("s", $correo); // "s" significa que la variable $correo es un string
    $stmt->execute();
    $result = $stmt->get_result();

    if ($usuarioEncontrado = $result->fetch_assoc()) {
        $contrasena_hash_db = $usuarioEncontrado['contrasena'];
        if (password_verify($contrasena_form, $contrasena_hash_db)) {
            
            $_SESSION['usuario'] = [
                "id" => $usuarioEncontrado['id'],
                "nombre" => $usuarioEncontrado['nombre'] . ' ' . $usuarioEncontrado['apellidos'],
                "tipo" => $usuarioEncontrado['tipo']
            ];
            
            echo json_encode([
                "success" => true, 
                "message" => "Inicio de sesión exitoso.", 
                "tipo" => $usuarioEncontrado['tipo']
            ]);

        } else {
            http_response_code(401); 
            echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
        }
    }

    $stmt->close();

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
    exit;
}
$conn->close();
?>