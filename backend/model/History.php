<?php

class History {

    private $conn;

    public function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function create($mascota_id, $descripcion) {
    try {
        $sql = "INSERT INTO historiales (mascota_id, fecha, procedimiento) 
                VALUES (?, NOW(), ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("is", $mascota_id, $descripcion);

        return $stmt->execute();
    } catch (Exception $e) {
        return false;
    }
}

public function viewHistory($mascota_id) {
    try {
        $sql = "SELECT fecha, procedimiento 
                FROM historiales 
                WHERE mascota_id = ?
                ORDER BY fecha DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $mascota_id);
        $stmt->execute();

        $resultado = $stmt->get_result();

        $historial = [];

        while ($row = $resultado->fetch_assoc()) {
            $historial[] = $row;
        }

        return $historial;
    } catch (Exception $e) {
        return false;
    }
}

   


}
?>
