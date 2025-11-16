<?php

require_once __DIR__ . '/../model/Pet.php';

class PetsController {

    private $modeloMascota;

    public function __construct(Pet $modeloMascota){
        $this->modeloMascota = $modeloMascota;
    }

    public function create() {

        if ($this->validateUser()) {
            $this->enviarRespuesta(401, false, "Acceso no autorizado. Debes iniciar sesión.");
            return;
        }
        
        $usuario_id = $_SESSION['usuario']['id'];

        $nombre = $_POST['nombre_mascota'] ?? '';
        $especie = $_POST['especie'] ?? '';
        $raza = $_POST['raza'] ?? '';
        $fecha_nacimiento = $_POST['fecha_nacimiento'] ?? ''; // El HTML debe enviar 'YYYY-MM-DD'

        if (empty($nombre) || empty($especie) || empty($raza) || empty($fecha_nacimiento)) {
            $this->enviarRespuesta(400, false, "Faltan datos obligatorios para la mascota.");
            return;
        }

        $exito = $this->modeloMascota->create(
            $usuario_id, 
            $nombre, 
            $especie, 
            $raza, 
            $fecha_nacimiento
        );

        if ($exito) {
            $this->enviarRespuesta(200, true, "Mascota registrada con éxito.");
        } else {
            $this->enviarRespuesta(500, false, "Error al registrar la mascota en la base de datos.");
        }
    }

    
    private function validateUser(){
        return !isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['id']);
    }
    private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }

}