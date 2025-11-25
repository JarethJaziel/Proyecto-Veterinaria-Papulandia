<?php
class Pet {
    private $conn;

    public function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function create($usuario_id, $nombre, $especie, $raza, $fecha_nacimiento) {
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

    public function getAll(){

        $sql = "SELECT id, nombre, especie, raza 
                FROM mascotas";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC); 

    }

    public function getByUserId($usuario_id) {
        $sql = "SELECT id, nombre, especie, raza 
                FROM mascotas 
                WHERE usuario_id = ?";
        $stmt = $this->conn->prepare($sql);

        if ($stmt === false) {
            return [];
        }

        $stmt->bind_param("i", $usuario_id);
        $stmt->execute();

        $resultado = $stmt->get_result();

        return $resultado->fetch_all(MYSQLI_ASSOC);
    }

    public function countPets() {
    $sql = "SELECT COUNT(*) AS total FROM mascotas";
    $result = $this->conn->query($sql);
    
    return $result->fetch_assoc()['total'] ?? 0;
    }

}
?>
