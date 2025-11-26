<?php

require_once __DIR__ . '/../model/Pet.php';

class PetsController {

    private $modeloMascota;

    public function __construct(Pet $modeloMascota){
        $this->modeloMascota = $modeloMascota;
    }

    public function create() {
        date_default_timezone_set('America/Mexico_City');

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

        $hoy = date('Y-m-d');

        // Validar fecha pasada estricta
        if ($fecha_nacimiento > $hoy) {
            $this->enviarRespuesta(400, false, "La fecha de nacimiento no debe ser futura a hoy.");
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

    public function deletePet(){
        if ($this->validateUser()) {
            $this->enviarRespuesta(401, false, "Acceso no autorizado. Debes iniciar sesión.");
            return;
        }

        $pet_id = $_POST['pet_id'] ?? null;

        if (!$pet_id) {
            $this->enviarRespuesta(400, false, "ID de la mascota no proporcionado.");
            return;
        }

        $resultado = $this->modeloMascota->deletePet($pet_id);

        if ($resultado) {
            $this->enviarRespuesta(200, true, "Mascota eliminada correctamente.");
        } else {
            $this->enviarRespuesta(500, false, "Error al eliminar la mascota.");
        }
    }

    public function getByUser() {
        if ($this->validateUser()) {
            $this->enviarRespuesta(401, false, "Acceso no autorizado. Debes iniciar sesión.");
            return;
        }

        $cliente_id = $_SESSION['usuario']['id'];
        
        if (empty($cliente_id)) {
            $this->enviarRespuesta(400, false, "Falta el ID del usuario.");
            return;
        }
        $mascotas = $this->modeloMascota->getByUserId($cliente_id);

        $this->enviarRespuesta(200, true, "Mascotas del usuario obtenidas con éxito.", [
            'mascotas' => $mascotas
        ]);
    }


    public function getAll(){
        
        $clientes = $this->modeloMascota->getAll();

        $this->enviarRespuesta(200,true,
        "Lista de clientes y mascotas obtenida exitosamente.",
      [
                            "clientes" => $clientes
                        ]
        );

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