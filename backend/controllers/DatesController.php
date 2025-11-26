<?php
require_once __DIR__ . '/../model/Date.php';

class DatesController {

    private $modeloCita;

    public function __construct(Date $modeloCita){
        $this->modeloCita = $modeloCita;
    }

    public function create() {
        date_default_timezone_set('America/Mexico_City');
        
        if (!isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['id'])) {
            $this->enviarRespuesta(401, false, "Acceso no autorizado. Debes iniciar sesión.");
            return;
        }

        $mascota_id = $_POST['mascota_id'] ?? '';
        $motivo = $_POST['motivo'] ?? '';
        $fecha = $_POST['fecha'] ?? '';
        $hora = $_POST['hora'] ?? '';

        if (empty($mascota_id) || empty($motivo) || empty($fecha) || empty($hora)) {
        $this->enviarRespuesta(400, false, "Faltan datos obligatorios para la cita.");
        return;
        }

        $hoy = date('Y-m-d');

        // Validar fecha futura estricta
        if ($fecha <= $hoy) {
            $this->enviarRespuesta(400, false, "La fecha de la cita debe ser posterior a hoy.");
            return;
        }

        $fecha_hora = $fecha . ' ' . $hora . ':00';

        if ($this->modeloCita->dateExist($fecha_hora)) {
            $this->enviarRespuesta(409, false, "Ya existe una cita programada para la fecha y hora seleccionadas.");
            return;
        }

        $exito = $this->modeloCita->create($mascota_id, $motivo, $fecha_hora);

        if ($exito) {
            $this->enviarRespuesta(200, true, "Cita registrada con éxito." );
        } else {
            $this->enviarRespuesta(406, false, "Error al registrar la cita en la base de datos.");
        }
    }

    public function getAll(){

        $dates = $this->modeloCita->getAll();

        $this->enviarRespuesta(200,true,
        "Lista de citas obtenidas exitosamente",
      [
                            "citas" => $dates
                        ]
        );


    }



    private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }
}
?>
