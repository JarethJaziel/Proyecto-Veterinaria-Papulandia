<?php
require_once '../model/Usuario.php';
require_once '../model/Cliente.php';

header('Content-Type: application/json');

$dataFile = '../../database/usuarios.json';
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombres = $_POST['nombres'] ?? '';
    $apellidos = $_POST['apellidos'] ?? '';
    $correo = $_POST['email'] ?? '';
    $contrasena = $_POST['password'] ?? '';
    $telefono = $_POST['telefono'] ??'';

    if (empty($nombres) || empty($apellidos) || empty($correo) || empty($contrasena)) {
        echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
        exit;
    }

    // Cargar los usuarios existentes
    $usuarios = json_decode(file_get_contents($dataFile), true);

    // Validar si el correo ya existe
    foreach ($usuarios as $user) {
        if ($user['correo'] === $correo) {
            echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
            exit;
        }
    }

    // Crear el objeto Cliente
    $cliente = new Cliente($nombres, $apellidos, $correo, $contrasena, $telefono);
    $cliente->setIdUsuario(count($usuarios) + 1);

    // Convertir el objeto a arreglo para guardarlo
    $nuevoUsuario = [
        "idUsuario" => $cliente->getIdUsuario(),
        "nombres" => $cliente->getNombres(),
        "apellidos" => $cliente->getApellidos(),
        "correo" => $cliente->getCorreo(),
        "contrasena" => $cliente->getContrasena(),
        "telefono"=> $cliente->getTelefono(),
        "tipo" => "cliente"
    ];

    // Guardar en JSON
    $usuarios[] = $nuevoUsuario;
    file_put_contents($dataFile, json_encode($usuarios, JSON_PRETTY_PRINT));

    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
