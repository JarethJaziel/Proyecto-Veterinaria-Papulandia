<?php
require_once __DIR__ . '/../model/History.php';

class HistoryController {

    private $modeloHistory;

    public function __construct(History $modeloHistory) {
        $this->modeloHistory = $modeloHistory;
    }

   public function create() {
    $mascota_id = $_POST["mascota_id"] ?? null;
    $procedimiento = $_POST["procedimiento"] ?? null;

    if (!$mascota_id || !$procedimiento) {
        return $this->enviarRespuesta(400, false, "Faltan datos obligatorios.");
    }

    $resultado = $this->modeloHistory->create($mascota_id, $procedimiento);

    if ($resultado) {
        return $this->enviarRespuesta(200, true, "Historial registrado correctamente.");
    } else {
        return $this->enviarRespuesta(500, false, "Error al registrar el historial.");
    }
}

public function viewHistory() {
    $mascota_id = $_GET["mascota_id"] ?? null;

    if (!$mascota_id) {
        return $this->enviarRespuesta(400, false, "No se proporcionó el ID de mascota.");
    }

    $historial = $this->modeloHistory->viewHistory($mascota_id);

    if ($historial === false) {
        return $this->enviarRespuesta(500, false, "Error al obtener el historial.");
    }

    return $this->enviarRespuesta(200, true, "Historial cargado correctamente.", [
        "data" => $historial
    ]);
}


    

    

    private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }

}
?>
