<?php
class User {
    private $conn;

    public function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function getByEmail($correo) {
        $sql = "SELECT id, nombre, apellidos, correo, contrasena, tipo FROM usuarios WHERE correo = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $correo);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc(); 
    }

    public function create($nombres, $apellidos, $correo, $hash_contrasena, $tipo, $telefono) {
        $sql = "INSERT INTO usuarios (nombre, apellidos, correo, contrasena, tipo, telefono) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssss", 
            $nombres, $apellidos, $correo, $hash_contrasena, $tipo, $telefono
        );
        return $stmt->execute(); // Devuelve true o false
    }
}
?>