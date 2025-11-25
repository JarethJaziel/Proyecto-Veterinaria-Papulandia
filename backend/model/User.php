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

    public function getAll(){
        $sql = "SELECT id, nombre, apellidos, correo, contrasena, tipo FROM usuarios";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC); 
    }

    public function getAllClients(){
        $sql = "SELECT id, nombre, apellidos, correo, telefono FROM usuarios WHERE tipo = 'cliente'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC); 
    }

    public function create($nombres, $apellidos, $correo, $hash_contrasena, $tipo, $telefono) {
        $sql = "INSERT INTO usuarios (nombre, apellidos, correo, contrasena, tipo, telefono) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssss", 
            $nombres, $apellidos, $correo, $hash_contrasena, $tipo, $telefono
        );
        if ($stmt->execute()) {
            return true;
        } else {
            // Si falla, devuelve el mensaje de error específico de mysqli
            return $stmt->error; 
        }
    }

    public function update($id, $nombres, $apellidos, $correo, $telefono) {
        $sql = "UPDATE usuarios 
                SET nombre = ?, apellidos = ?, correo = ?, telefono = ? 
                WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssi", 
            $nombres, $apellidos, $correo, $telefono, $id
        );
        return $stmt->execute();
    }

    public function countClients() {
    $sql = "SELECT COUNT(*) AS total FROM usuarios WHERE tipo = 'cliente'";
    $result = $this->conn->query($sql);

    return $result->fetch_assoc()['total'] ?? 0;
    }

}
?>