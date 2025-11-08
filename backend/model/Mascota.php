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

        // Bindeamos los parámetros
        // i = integer (usuario_id)
        // s = string (para nombre, especie, raza y fecha_nacimiento)
        $stmt->bind_param("issss", 
            $usuario_id, 
            $nombre, 
            $especie, 
            $raza, 
            $fecha_nacimiento
        );
        
        // Devuelve true si la ejecución fue exitosa, o false si falló
        return $stmt->execute();
    }

    public function obtenerPorUsuarioId($usuario_id) {
        // $sql = "SELECT * FROM mascotas WHERE usuario_id = ?";
    }
}
?>