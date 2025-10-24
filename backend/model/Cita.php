<?php
class Cita{
    private $idCita;
    private $cliente;
    private $fecha;
    private $hora;
    
    public function __construct($cliente,$fecha,$hora){
        $this->cliente=$cliente;
        $this->fecha = $fecha;
        $this->hora = $hora;
    }
    public function getIdCita(){
        return $this->idCita;
    }
    public function getFecha(){
        return $this->fecha;
    }
    public function getHora(){
        return $this->hora;
    }
    public function getIdCliente(){
        return $this->cliente->getIdCliente();
    }
    public function setIdCita($idCita){
        $this->idCita = $idCita;
    }
    public function setFecha($fecha){
        $this->fecha = $fecha;
    }
    public function setHora($hora){
        $this->hora = $hora;
    }
    public function setCliente($cliente){
        $this->cliente = $cliente;
    }
}