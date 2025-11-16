<?php
require_once __DIR__ . '/../model/Pet.php';
require_once __DIR__ . '/../model/Date.php';
require_once __DIR__ . '/../model/User.php';
class AdminDashboardController {
    private $modeloMascota;
    private $modeloCita;
    private $modeloUser;

    // Recibe los dos modelos que necesita
    public function __construct($modeloMascota, $modeloCita, $modeloUser) {
        $this->modeloMascota = $modeloMascota;
        $this->modeloCita = $modeloCita;
        $this->modeloUser = $modeloUser;
    }

    public function getAdminDashboard() {
        if ($this->validateUser()) {
            $this->enviarRespuesta(401, false, "Acceso no autorizado.");
            return;
        }
        $usuario_id = $_SESSION['usuario']['id'];

        $numPets = $this->modeloMascota->getNumAll();
        $numUsers = $this->modeloUser->getNumAll();
        $todayDates = $this->modeloCita->getTodayDates();
        
        $response = [];

        $response['num_pets'] = $numPets;
        $response['num_users'] = $numUsers;
        $response['num_dates'] = $todayDates->size();

        $response['today_dates'] = $todayDates;

        $this->enviarRespuesta(200, true, "Datos del dashboard obtenidos", $response);

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