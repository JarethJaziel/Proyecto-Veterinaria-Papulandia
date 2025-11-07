<?php

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Usa automáticamente la zona horaria de la PC
date_default_timezone_set(ini_get('date.timezone') ?: date_default_timezone_get());

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$db_name = $_ENV['DB_NAME'];

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Error interno del servidor: Falla de conexión a la BD."
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombres = $_POST['nombres'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $correo = $_POST['email'] ?? '';
    $contrasena_form = $_POST['password'] ?? '';
    $telefono = $_POST['telefono'] ?? '';

    $tipo = 'cliente';
    $fechaCuenta = date('Y-m-d H:i:s'); // Fecha actual con hora de la PC

    if (empty($nombres) || empty($apellidos) || empty($correo) || empty($contrasena_form)) {
        echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
        exit;
    }

    $contrasena = password_hash($contrasena_form, PASSWORD_DEFAULT);

    $sqlQuery = "INSERT INTO usuarios (nombre, apellidos, correo, contrasena, telefono, tipo, FCuenta) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sqlQuery);

    $stmt->bind_param("sssssss", 
        $nombres, 
        $apellidos, 
        $correo, 
        $contrasena,
        $telefono,
        $tipo,
        $fechaCuenta
    );

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Usuario registrado con éxito."]);
    } else {
        http_response_code(500);
        $error_message = $stmt->error;
        echo json_encode(["success" => false, "message" => "Error al registrar el usuario: " . $error_message]);
    }

    $stmt->close();
    $conn->close();

} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
