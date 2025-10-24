<?php
session_start();

// Verificar que el usuario sea administrador
if (!isset($_SESSION['usuario']) || $_SESSION['usuario']['tipo'] !== 'admin') {
    header("Location: ../../frontend/pages/login.html");
    exit;
}

$usuario = $_SESSION['usuario'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Panel del Administrador - Papulandia</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet"> 
    <link href="../../frontend/css/styles.css" rel="stylesheet">
    <link href="../../frontend/css/dashboard_admin.css" rel="stylesheet">
</head>
<body>
    <header>
        <nav id="main-nav" class="navbar navbar-expand-lg bg-white shadow-sm fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="../../index.php">Papulandia</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto align-items-center">
                        <li class="nav-item me-3">
                            <span class="fw-semibold text-secondary">
                                <i class="bi bi-person-circle me-1"></i>
                                <?= htmlspecialchars($usuario['nombre']) ?> (Admin)
                            </span>
                        </li>
                        <li class="nav-item">
                            <a href="../api/logout.php" class="btn btn-outline-danger">
                                <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    
    <main class="container py-5">
        <div class="text-center mb-5">
            <h2 class="fw-bold text-success">Panel del Administrador</h2>
            <p class="text-muted">Gestiona citas, clientes y controla el sistema de la veterinaria.</p>
        </div>

        <div class="row justify-content-center g-4">
            <div class="col-md-4">
                <div class="card card-dashboard border-success">
                    <div class="card-body text-center">
                        <h5 class="card-title">Ver Citas</h5>
                        <p class="card-text text-muted">Consulta todas las citas registradas y su estado.</p>
                        <a href="ver_citas.php" class="btn btn-success">Ver citas</a>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card card-dashboard border-warning">
                    <div class="card-body text-center">
                        <h5 class="card-title">Gestionar Clientes</h5>
                        <p class="card-text text-muted">Consulta, edita o elimina clientes registrados.</p>
                        <a href="gestionar_clientes.php" class="btn btn-warning text-white">Administrar</a>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <footer class="text-center p-3 bg-dark text-light mt-5">
        <p class="mb-0">&copy; 2025 Veterinaria Papulandia | Panel de administración</p>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
