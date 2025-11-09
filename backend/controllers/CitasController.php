<?php

require_once __DIR__ . '/../model/Cita.php';

class MascotasCita {

    private $modeloCita;

    public function __construct(Cita $modeloCita){
        $this->modeloCita = $modeloCita;
    }

    public function crear() {

    }

    private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }

}