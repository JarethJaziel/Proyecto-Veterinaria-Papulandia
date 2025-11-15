
$(document).ready(function() {
    
    // Hacemos la llamada para verificar la sesión y obtener los datos
    $.ajax({
        url: RUTA_BASE + 'backend/api/checkSession.php',
        method: 'GET',
        dataType: 'json',
        xhrFields: { withCredentials: true }
    })
    .done(function(data) {
        
        // 1. PROTEGER LA PÁGINA (Paso de seguridad)
        // Si no está autenticado, O NO ES del tipo correcto...
        if (!data.auth || data.usuario.tipo !== 'admin') { 
            // ¡Lo sacamos de aquí!
            window.location.href = '../pages/login.html';
            return;
        }

        // 2. INYECTAR LOS DATOS (¡Tu solicitud!)
        // Si llegamos aquí, es un admin autenticado.
        const usuario = data.usuario;
        
        // Usamos .text() para inyectar el nombre de forma segura
        $('#navbarUsername').text(usuario.nombre); 
        
        // Inyectamos el tipo de usuario
        $('#navbarUserType').text('(Admin)');
        
        // (En este punto también podrías cargar tablas, gráficas, etc.)

    })
    .fail(function() {
        // Si la llamada AJAX falla (error 401, 500, etc.),
        // asumimos que no está autenticado.
        window.location.href = '../pages/login.html';
    });

});