<?php
class Date {
    private $conn;

    public function __construct($db_connection) {
        $this->conn = $db_connection;
    }

    public function create($mascota_id, $fecha) {
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

    public function getByUserId($usuario_id) {
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

    public function getByPetId($mascota_id) {
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

    public function getNextPetsDates($array_de_ids_mascota) {
        if (empty($array_de_ids_mascota)) {
            return [];
        }

        // Preparamos los placeholders (?,?,?) para el IN()
        $placeholders = implode(',', array_fill(0, count($array_de_ids_mascota), '?'));
        // Preparamos los tipos ('iii')
        $types = str_repeat('i', count($array_de_ids_mascota));

        // Esta es la lógica de "próxima cita"
        $sql = "SELECT 
                    mascota_id, 
                    MIN(fecha) as proxima_cita
                FROM 
                    citas
                WHERE 
                    fecha >= NOW() 
                    AND mascota_id IN ($placeholders)
                GROUP BY 
                    mascota_id";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param($types, ...$array_de_ids_mascota);
        $stmt->execute();
        $result = $stmt->get_result();

        $citasMap = [];
        while ($row = $result->fetch_assoc()) {
            $citasMap[$row['mascota_id']] = $row['proxima_cita'];
        }
        
        // Devuelve un mapa: [id_mascota => fecha]
        return $citasMap;
    }
}
?>
