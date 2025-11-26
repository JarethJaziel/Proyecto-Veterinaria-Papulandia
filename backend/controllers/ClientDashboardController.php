<?php
require_once __DIR__ . '/../model/Pet.php';
require_once __DIR__ . '/../model/Date.php';
class ClientDashboardController {
    private $modeloMascota;
    private $modeloCita;

    // Recibe los dos modelos que necesita
    public function __construct($modeloMascota, $modeloCita) {
        $this->modeloMascota = $modeloMascota;
        $this->modeloCita = $modeloCita;
    }

    public function getClienteDashboard() {
        if ($this->validateUser()) {
            $this->enviarRespuesta(401, false, "Acceso no autorizado.");
            return;
        }
        $usuario_id = $_SESSION['usuario']['id'];

        $mascotas = $this->modeloMascota->getByUserId($usuario_id);

        if (empty($mascotas)) {
            $this->enviarRespuesta(200, true, "El usuario no tiene mascotas.", ['mascotas' => []]);
            return;
        }

        // Sacamos los IDs de las mascotas que encontramos
        $mascota_ids = array_map(fn($m) => $m['id'], $mascotas);
        
        // Le pedimos al modelo Cita las próximas citas para ESOS IDs
        $proximasCitasMap = $this->modeloCita->getNextPetsDates($mascota_ids);

        // Recorremos las mascotas y les "pegamos" su próxima cita
        foreach ($mascotas as $index => $mascota) {
            $id = $mascota['id'];
            if (isset($proximasCitasMap[$id])) {
                // Si encontramos cita para esta mascota, la añadimos
                $mascotas[$index]['proxima_cita'] = $proximasCitasMap[$id];
            } else {
                $mascotas[$index]['proxima_cita'] = null;
            }
        }

        $this->enviarRespuesta(200, true, "Datos del dashboard obtenidos", [
            'mascotas' => $mascotas
        ]);
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
?>