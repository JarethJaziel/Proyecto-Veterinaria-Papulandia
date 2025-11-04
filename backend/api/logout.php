<?php
ini_set('session.cookie_path', '/');
session_start();
session_unset();
session_destroy();
header("Location: ../../index.php");
exit;
?>