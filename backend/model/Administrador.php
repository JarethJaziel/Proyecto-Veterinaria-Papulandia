<?php
class Administrador extends Usuario{
    public function __construct($nombres,$apellidos,$correo,$contrasena){
        parent::__construct($nombres,$apellidos,$correo,$contrasena);
    }
}