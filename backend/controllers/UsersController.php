<?php

require_once __DIR__ . '/../model/User.php';

class UsersController {
    private $modeloUsuario;

    public function __construct(User $modeloUsuario) {
        $this->modeloUsuario = $modeloUsuario;
    }

    public function login() {
        $correo = $_POST['email'] ?? '';
        $contrasena_form = $_POST['contrasena'] ?? '';

        if (empty($correo) || empty($contrasena_form)) {
            $this->enviarRespuesta(400, false, "Correo o contraseña vacíos.");
            return; // Detiene la ejecución
        }

        $usuarioEncontrado = $this->modeloUsuario->getByEmail($correo);

        if ($usuarioEncontrado && password_verify($contrasena_form, $usuarioEncontrado['contrasena'])) {
            // Éxito
            $_SESSION['usuario'] = [
                "id" => $usuarioEncontrado['id'],
                "nombre" => $usuarioEncontrado['nombre'] . ' ' . $usuarioEncontrado['apellidos'],
                "tipo" => $usuarioEncontrado['tipo']
            ];
            $this->enviarRespuesta(200, true, "Inicio de sesión exitoso.", ["tipo" => $usuarioEncontrado['tipo']]);
        } else {
            // Fracaso
            $this->enviarRespuesta(401, false, "Correo o contraseña incorrectos.");
        }
    }

    public function register() {
        $nombres = $_POST['nombres'] ?? '';
        $apellidos = $_POST['apellidos'] ?? '';
        $correo = $_POST['email'] ?? '';
        $contrasena_form = $_POST['password'] ?? '';
        $telefono = $_POST['telefono'] ??'';
        $tipo = 'cliente'; // Hardcodeado para que no pueda elegir

        if (empty($nombres) || empty($apellidos) || empty($correo) || empty($contrasena_form)) {
            $this->enviarRespuesta(400, false, "Faltan datos obligatorios.");
            return;
        }

        $contrasena = password_hash($contrasena_form, PASSWORD_DEFAULT);

        $exito = $this->modeloUsuario->create(
            $nombres, $apellidos, $correo, $contrasena, $tipo, $telefono
        );

        if ($exito === true) {
            $this->enviarRespuesta(200, true, "Éxito");
        } else {
            // $resultado trae el texto del error
            $this->enviarRespuesta(500, false, "Error: " . $exito);
        }
    }

    public function getAllClients(){
        if($this->validateAdmin()){
            $this->enviarRespuesta(403, false, "Acceso no autorizado.");
            return;
        }

        $clientes = $this->modeloUsuario->getAllClients();

        $this->enviarRespuesta(200,true,
        "Lista de clientes obtenida exitosamente.",
      [
                            "clientes" => $clientes
                        ]
        );

    }

    

    public function updateUser(){
        if($this->validateAdmin()){
            $this->enviarRespuesta(403, false, "Acceso no autorizado.");
            return;
        }

        $id = $_POST['id'] ?? '';
        $nombres = $_POST['nombres'] ?? '';
        $apellidos = $_POST['apellidos'] ?? '';
        $correo = $_POST['email'] ?? '';
        $telefono = $_POST['telefono'] ?? '';

        if (empty($id) || empty($nombres) || empty($apellidos) || empty($correo)) {
            $this->enviarRespuesta(400, false, "Faltan datos obligatorios.");
            return;
        }

        $exito = $this->modeloUsuario->update(
            $id, $nombres, $apellidos, $correo, $telefono
        );

        if ($exito) {
            $this->enviarRespuesta(200, true, "Usuario actualizado con éxito.");
        } else {
            $this->enviarRespuesta(500, false, "Error al actualizar el usuario en la base de datos.");
        }
    }

    private function validateAdmin(){
        return (!isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['id'])) 
                && ($_SESSION['usuario']['tipo'] !== 'admin');
    }

    private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        // fusiona los datos adicionales (como el 'rol')
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }
}
?>