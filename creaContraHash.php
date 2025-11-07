<?php
/*
 * ESTE ES UN SCRIPT TEMPORAL SÓLO PARA GENERAR UN HASH
 */

// ---- PON LA CONTRASEÑA QUE QUIERAS USAR AQUÍ ----
$contrasenaPlana = '12345';
// ------------------------------------------------


$hash_para_db = password_hash($contrasenaPlana, PASSWORD_DEFAULT);

echo "¡Tu hash está listo! Copia la siguiente línea y pégala en phpMyAdmin:";
echo "<hr>";

// Te lo ponemos en un <input> para que sea fácil de copiar
echo '<input type="text" value="' . $hash_para_db . '" size="100">';

// Y también lo imprimimos por si acaso
echo "<br><br>";
echo $hash_para_db;

?>