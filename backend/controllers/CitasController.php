<?php
require_once __DIR__ . '/../model/Cita.php';

class CitasController {

    private $modeloCita;

    public function __construct(Cita $modeloCita){
        $this->modeloCita = $modeloCita;
    }

    public function crear() {
        
        
        if (!isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['id'])) {
            $this->enviarRespuesta(401, false, "Acceso no autorizado. Debes iniciar sesión.");
            return;
        }

        $mascota_id = $_POST['mascota_id'] ?? '';
        $fecha = $_POST['fecha'] ?? '';
        $hora = $_POST['hora'] ?? '';

        if (empty($mascota_id) || empty($fecha) || empty($hora)) {
        $this->enviarRespuesta(400, false, "Faltan datos obligatorios para la cita.");
        return;
        }

        $fecha_hora = $fecha . ' ' . $hora . ':00';

        $exito = $this->modeloCita->crear($mascota_id, $fecha_hora);

        if ($exito) {
            $this->enviarRespuesta(200, true, "Cita registrada con éxito." );
        } else {
            $this->enviarRespuesta(500, false, "Error al registrar la cita en la base de datos.");
        }
    }

    private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }
}
?>
