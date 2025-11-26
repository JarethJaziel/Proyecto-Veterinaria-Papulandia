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

    public function updateUserType($id, $newType) {
        $sql = "UPDATE usuarios 
                SET tipo = ? 
                WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("si", 
            $newType, $id
        );
        return $stmt->execute();
    }
    
    public function countClients() {
    $sql = "SELECT COUNT(*) AS total FROM usuarios WHERE tipo = 'cliente'";
    $result = $this->conn->query($sql);

    return $result->fetch_assoc()['total'] ?? 0;
    }

    public function deleteUser($id)
{
    // 1. Obtener todas las mascotas del usuario
    $sqlMascotas = "SELECT id FROM mascotas WHERE usuario_id = ?";
    $stmtM = $this->conn->prepare($sqlMascotas);
    $stmtM->bind_param("i", $id);
    $stmtM->execute();
    $result = $stmtM->get_result();

    // 2. Por cada mascota, eliminar historial y citas
    while ($row = $result->fetch_assoc()) {
        $mascotaId = $row['id'];

        // 2.1 Eliminar historial
        $sqlHistorial = "DELETE FROM historiales WHERE mascota_id = ?";
        $stmtHist = $this->conn->prepare($sqlHistorial);
        $stmtHist->bind_param("i", $mascotaId);
        $stmtHist->execute();

        // 2.2 Eliminar citas
        $sqlCitas = "DELETE FROM citas WHERE mascota_id = ?";
        $stmtCitas = $this->conn->prepare($sqlCitas);
        $stmtCitas->bind_param("i", $mascotaId);
        $stmtCitas->execute();
    }

    // 3. Eliminar mascotas
    $sql1 = "DELETE FROM mascotas WHERE usuario_id = ?";
    $stmt1 = $this->conn->prepare($sql1);
    $stmt1->bind_param("i", $id);
    $stmt1->execute();

    // 4. Eliminar usuario
    $sql2 = "DELETE FROM usuarios WHERE id = ?";
    $stmt2 = $this->conn->prepare($sql2);
    $stmt2->bind_param("i", $id);

    return $stmt2->execute();
}



}
?>