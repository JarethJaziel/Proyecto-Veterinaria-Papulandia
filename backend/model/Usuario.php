<?php

class Usuario{
    private $idUsuario;
    private $nombres;
    private $apellidos;
    private $correo;
    private $contrasena;

    public function __construct($nombres, $apellidos, $correo, $contrasena){
        $this->nombres = $nombres;
        $this->apellidos = $apellidos;
        $this->correo = $correo;
        $this->contrasena = $contrasena;
    }

    public function getIdUsuario(){
        return $this->idUsuario;
    }
    public function getNombres(){
        return $this->nombres;
    }
    public function getApellidos(){
        return $this->apellidos;
    }
    public function getContrasena(){
        return $this->contrasena;
    }
    public function getCorreo(){
        return $this->correo;
    }

    public function setIdUsuario($idUsuario){
        $this->idUsuario = $idUsuario;
    }
    public function setNombres($nombres){
        $this->nombres = $nombres;
    }
    public function setApellidos($apellidos){
        $this->apellidos = $apellidos;
    }
    public function setContrasena($contrasena){
        $this->contrasena = $contrasena;
    }
    public function setCorreo($correo){
        $this->correo = $correo;
    }


}