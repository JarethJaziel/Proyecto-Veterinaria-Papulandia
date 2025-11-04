<?php
ini_set('session.cookie_path', '/');
session_start();
header('Content-Type: application/json');

$dataFile = '../../database/usuarios.json';
if (!file_exists($dataFile)) {
    // Es mejor crear un JSON vacío válido (un array u objeto)
    file_put_contents($dataFile, json_encode([])); 
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['email'] ?? '';
    $contrasena = $_POST['contrasena'] ?? '';

    if (empty($correo) || empty($contrasena)) {
        http_response_code(400); 
        echo json_encode(["success" => false, "message" => "Correo o contraseña vacíos."]);
        exit; 
    }

    $usuarios = json_decode(file_get_contents($dataFile), true);
    $usuarioEncontrado = null;

    foreach ($usuarios as $user) {
        if ($user['correo'] === $correo && $user['contrasena'] === $contrasena) {
            $usuarioEncontrado = $user;
            break;
        }
    }

    if ($usuarioEncontrado) {
        $_SESSION['usuario'] = [
            "id" => $usuarioEncontrado['idUsuario'],
            "nombre" => $usuarioEncontrado['nombres'],
            "tipo" => $usuarioEncontrado['tipo']
        ];
        session_write_close();
        echo json_encode([
            "success" => true, 
            "message" => "Inicio de sesión exitoso.", 
            "tipo" => $usuarioEncontrado['tipo']
        ]);
        exit;

    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
        exit;
    }

} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
    exit;
}
?>