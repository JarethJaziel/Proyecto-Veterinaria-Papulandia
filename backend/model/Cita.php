<?php
class Cita {
    private $conn;

    public function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function crear($mascota_id, $fecha) {
        $sql = "INSERT INTO citas (mascota_id, fecha) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return false;
        }

        // i = integer (mascota_id)
        // s = string (fecha)
        $stmt->bind_param("is", 
            $mascota_id, 
            $fecha
        );

        return $stmt->execute();
    }

    public function obtenerPorUsuarioId($usuario_id) {
        $sql = "SELECT c.id, c.mascota_id, c.fecha, m.nombre AS nombre_mascota, m.especie
                FROM citas c
                INNER JOIN mascotas m ON c.mascota_id = m.id
                WHERE m.usuario_id = ?
                ORDER BY c.fecha ASC";
        
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return [];
        }

        $stmt->bind_param("i", $usuario_id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    public function obtenerPorMascotaId($mascota_id) {
        $sql = "SELECT id, mascota_id, fecha FROM citas WHERE mascota_id = ? ORDER BY fecha ASC";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return [];
        }

        $stmt->bind_param("i", $mascota_id);
        $stmt->execute();
        $result = $stmt->get_result();

        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }
}
?>
