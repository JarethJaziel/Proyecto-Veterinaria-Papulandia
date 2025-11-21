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
        $totalMascotas = $this->modeloMascota->contarMascotas();
        $totalClientes = $this->modeloUsuario->contarClientes();
        $citasHoy = $this->modeloCita->contarCitasHoy();

        $this->enviarRespuesta(200,true,
        "Datos del dashboard.",
        [
            "mascotas" => $totalMascotas,
            "clientes" => $totalClientes,
            "citas_hoy" => $citasHoy
        ]
    );

    }

     private function enviarRespuesta($codigoEstado, $success, $message, $datosAdicionales = []) {
        http_response_code($codigoEstado);
        $respuesta = ["success" => $success, "message" => $message];
        echo json_encode(array_merge($respuesta, $datosAdicionales));
    }

}
