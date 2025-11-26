
$(document).ready(function() {
    
    $.ajax({
        url: RUTA_BASE + 'backend/api/checkSession.php',
        method: 'GET',
        dataType: 'json',
        xhrFields: { withCredentials: true }
    })
    .done(function(data) {
        
        if (!data.auth || data.usuario.tipo !== 'admin') { 
            window.location.href = 'pages/login.html';
            return;
        }

        const usuario = data.usuario;
        
        $('#navbarUsername').text(usuario.nombre); 
        
        $('#navbarUserType').text('(Admin)');

    })
    .fail(function() {
        window.location.href = 'pages/login.html';
    });

});