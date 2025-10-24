<?php
session_start();

// Si hay sesión iniciada
if (isset($_SESSION['usuario'])) {
    $usuario = $_SESSION['usuario'];

    // Según el tipo de usuario, redirige a su dashboard
    if ($usuario['tipo'] === 'admin') {
        header("Location: ../views/dashboard_admin.php");
        exit;
    } elseif ($usuario['tipo'] === 'cliente') {
        header("Location: ../views/dashboard_cliente.php");
        exit;
    } else {
        // Si hay sesión pero el tipo no se reconoce
        header("Location: ../../frontend/pages/login.html");
        exit;
    }
} else {
    // Si NO hay sesión iniciada, redirige al login
    header("Location: ../../frontend/pages/login.html");
    exit;
}
?>
