<?php
require_once '../model/Usuario.php';
require_once '../model/Cliente.php';
require_once '../model/Administrador.php';

session_start();
header('Content-Type: application/json');

$dataFile = '../../database/usuarios.json';
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $correo = $_POST['email'] ?? '';
    $contrasena = $_POST['password'] ?? '';

    if (empty($correo) || empty($contrasena)) {
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
        if ($usuarioEncontrado['tipo'] === 'cliente') {
            $userObj = new Cliente(
                $usuarioEncontrado['nombres'],
                $usuarioEncontrado['apellidos'],
                $usuarioEncontrado['correo'],
                $usuarioEncontrado['contrasena'],
                $usuarioEncontrado['telefono'],
                
            );
        } else if ($usuarioEncontrado['tipo'] === 'admin') {
            $userObj = new Administrador(
                $usuarioEncontrado['nombres'],
                $usuarioEncontrado['apellidos'],
                $usuarioEncontrado['correo'],
                $usuarioEncontrado['contrasena']
            );
        } else {
            $userObj = null;
        }

        $userObj->setIdUsuario($usuarioEncontrado['idUsuario']);
        $_SESSION['usuario'] = [
            "id" => $usuarioEncontrado['idUsuario'],
            "nombre" => $usuarioEncontrado['nombres'],
            "tipo" => $usuarioEncontrado['tipo']
        ];

        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso.", "tipo" => $usuarioEncontrado['tipo']]);
    } else {
        echo json_encode(["success" => false, "message" => "Correo o contraseña incorrectos."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido."]);
}
?>
