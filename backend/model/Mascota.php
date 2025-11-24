<?php
class Mascota {
    private $conn;

    public function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function crear($usuario_id, $nombre, $especie, $raza, $fecha_nacimiento) {
        $sql = "INSERT INTO mascotas (usuario_id, nombre, especie, raza, fecha_nacimiento) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return false;
        }

        $stmt->bind_param("issss", 
            $usuario_id, 
            $nombre, 
            $especie, 
            $raza, 
            $fecha_nacimiento
        );

        return $stmt->execute();
    }

    public function obtenerPorUsuarioId($usuario_id) {
        $sql = "SELECT id, nombre, especie FROM mascotas WHERE usuario_id = ?";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return [];
        }

        $stmt->bind_param("i", $usuario_id);
        $stmt->execute();

        $resultado = $stmt->get_result();
        $mascotas = [];

        while ($fila = $resultado->fetch_assoc()) {
            $mascotas[] = $fila;
        }

        return $mascotas;
    }
}
?>
