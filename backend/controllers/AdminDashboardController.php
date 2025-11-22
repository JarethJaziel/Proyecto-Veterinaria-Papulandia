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

    public function getAllClients(){
        if($this->validateUser()){
            $this->enviarRespuesta(403, false, "Acceso no autorizado.");
            return;
        }

        $clientes = $this->modeloUsuario->getAllClients();

        $this->enviarRespuesta(200,true,
        "Lista de clientes obtenida exitosamente.",
      [
                            "clientes" => $clientes
                        ]
        );

    }

    public function updateUser(){
        if($this->validateUser()){
            $this->enviarRespuesta(403, false, "Acceso no autorizado.");
            return;
        }

        $id = $_POST['id'] ?? '';
        $nombres = $_POST['nombres'] ?? '';
        $apellidos = $_POST['apellidos'] ?? '';
        $correo = $_POST['email'] ?? '';
        $telefono = $_POST['telefono'] ?? '';

        if (empty($id) || empty($nombres) || empty($apellidos) || empty($correo)) {
            $this->enviarRespuesta(400, false, "Faltan datos obligatorios.");
            return;
        }

        $exito = $this->modeloUsuario->update(
            $id, $nombres, $apellidos, $correo, $telefono
        );

        if ($exito) {
            $this->enviarRespuesta(200, true, "Usuario actualizado con éxito.");
        } else {
            $this->enviarRespuesta(500, false, "Error al actualizar el usuario en la base de datos.");
        }
    }

    public function getStats() {
        if($this->validateUser()){
            $this->enviarRespuesta(403, false, "Acceso no autorizado.");
            return;
        }

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
