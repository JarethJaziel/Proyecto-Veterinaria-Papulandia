<?php
class Mascota{
    private $idMascota;
    private $duenio;
    private $nombre;
    private $especie;
    private $raza;
    private $fecha_nacimiento;
    private $historial=[];
    
 public function __construct($duenio, $nombre, $especie, $raza, $fecha_nacimiento) {
        $this->duenio = $duenio;
        $this->nombre = $nombre;
        $this->especie = $especie;
        $this->raza = $raza;
        $this->fecha_nacimiento = $fecha_nacimiento;
    }

    // Getters
    public function getIdMascota() {
        return $this->idMascota;
    }
    public function getDuenio() {
        return $this->duenio;
    }
    public function getNombre() {
        return $this->nombre;
    }
    public function getEspecie() {
        return $this->especie;
    }
    public function getRaza() {
        return $this->raza;
    }
    public function getFechaNacimiento() {
        return $this->fecha_nacimiento;
    }
    public function getHistorial() {
        return $this->historial;
    }

    // Setters
    public function setIdMascota($idMascota) {
        $this->idMascota = $idMascota;
    }
    public function setDuenio($duenio) {
        $this->duenio = $duenio;
    }
    public function setNombre($nombre) {
        $this->nombre = $nombre;
    }
    public function setEspecie($especie) {
        $this->especie = $especie;
    }
    public function setRaza($raza) {
        $this->raza = $raza;
    }
    public function setFechaNacimiento($fecha_nacimiento) {
        $this->fecha_nacimiento = $fecha_nacimiento;
    }
    public function setHistorial($historial) {
        $this->historial = $historial;
    }

    // Método para calcular edad aproximada
    public function getEdad() {
        $fecha_nac = new DateTime($this->fecha_nacimiento);
        $hoy = new DateTime();
        $edad = $hoy->diff($fecha_nac);
        return $edad->y . " años, " . $edad->m . " meses";
    }

    // Añadir entrada al historial
    public function addHistorial($descripcion, $fecha = null) {
        if ($fecha === null) {
            $fecha = date("Y-m-d");
        }
        $this->historial[] = [
            "fecha" => $fecha,
            "descripcion" => $descripcion
        ];
    }
}