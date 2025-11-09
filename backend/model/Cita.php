<?php
class Cita {
    private $conn;

    public function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function crear($mascota_id, $fecha) {
        
    }

    public function obtenerPorUsuarioId($usuario_id) {
        // $sql = "SELECT * FROM citas WHERE mascota_id = ?"
        //JOIN mascotas JOIN clientes...;
    }

    public function obtenerPorMascotaId($mascota_id) {
        // $sql = "SELECT * FROM citas WHERE mascota_id = ?";
    }

}
?>