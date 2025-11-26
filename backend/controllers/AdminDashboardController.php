<?php

class AdminDashboardController {

    private $modeloMascota;
    private $modeloUsuario;
    private $modeloCita;

    public function __construct($modeloMascota, $modeloUsuario, $modeloCita) {
        $this->modeloMascota = $modeloMascota;
        $this->modeloUsuario = $modeloUsuario;
        $this->modeloCita = $modeloCita;
    }

    

    public function getStats() {
        if($this->validateUser()){
            $this->enviarRespuesta(403, false, "Acceso no autorizado.");
            return;
        }

        $totalMascotas = $this->modeloMascota->countPets();
        $totalClientes = $this->modeloUsuario->countClients();
        $totalCitasHoy = $this->modeloCita->countUpcomingDates();
        $listaCitasHoy = $this->modeloCita->getUpcomingDates();

        $this->enviarRespuesta(200,true,
        "Datos del dashboard.",
      [
                            "mascotas" => $totalMascotas,
                            "clientes" => $totalClientes,
                            "citas_proximas" => $totalCitasHoy,
                            "lista_citas" => $listaCitasHoy
                        ]
        );

    }

    private function validateUser(){
        return (!isset($_SESSION['usuario']) || !isset($_SESSION['usuario']['id'])) 
                && ($_SESSION['usuario']['tipo'] !== 'admin');
    }

     private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }

}
