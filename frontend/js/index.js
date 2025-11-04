$(document).ready(function() {

    // 1. Busca el botón con id "btnDashboard" y espera un clic
    $('#btnDashboard').on('click', function(e) {
        
        // 2. Evita que el enlace <a> navegue a "#"
        e.preventDefault(); 

        // 3. Inicia la revisión de la sesión contra tu backend
        $.ajax({
            url: '../backend/api/checkSession.php', // Ruta a tu API
            method: 'GET',
            dataType: 'json',
            xhrFields: { 
                withCredentials: true // Necesario para enviar cookies de sesión
            }
        })
        .done(function(data) {
            // 4. El backend respondió. Comprobamos la autenticación.
            if (data && data.auth === true) {
                // SÍ está autenticado. Redirigir según el tipo.
                const tipo = data.usuario.tipo;

                if (tipo === 'admin') {
                    window.location.href = 'pages/dashboard_admin.html';
                } else if (tipo === 'cliente') {
                    window.location.href = 'pages/dashboard_cliente.html';
                } else {
                    // Tipo desconocido, enviar a login por si acaso
                    window.location.href = 'pages/login.html';
                }
            } else {
                // NO está autenticado (data.auth es false o no existe)
                window.location.href = 'pages/login.html';
            }
        })
        .fail(function() {
            // 5. El backend falló (error 500, 404, etc.)
            // Por seguridad, se asume que no está logueado.
            window.location.href = 'pages/login.html';
        });
    });

});