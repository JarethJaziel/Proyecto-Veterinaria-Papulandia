<?php
class Cliente extends Usuario {

    private $mascotas=[];
    private $citas=[];
    private $telefono;
    public function __construct($nombres, $apellidos, $correo, $contrasena, $telefono) {
        parent::__construct($nombres,$apellidos,$correo,$contrasena);
        $this->telefono=$telefono;
    }
    public function getMascotas() {
        return $this->mascotas;
    }
    public function setMascotas($mascotas) {
        $this->mascotas = $mascotas;
    }
    public function getTelefono(){
        return $this->telefono;
    }
    public function setTelefono($telefono) {
        $this->telefono = $telefono;
    }
    public function getCitas() {
        return $this->citas;
    }
    public function setCitas($citas) {
        $this->citas = $citas;
    }
    public function addMascota($mascota){
        $this->mascotas[] = $mascota;
    }
    public function addCita($cita){
        $this->citas[] = $cita;
    }

}