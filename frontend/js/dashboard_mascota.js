$(document).ready(function() {
    let usuarioId = null; // se llenará desde el backend

    // Verificar sesión y obtener el usuario logueado
    $.ajax({
        url: '../../backend/api/checkSession.php',
        method: 'GET',
        dataType: 'json',
        xhrFields: { withCredentials: true }
    })
    .done(function(data) {
        if (!data.auth || data.usuario.tipo !== 'cliente') {
            window.location.href = '../pages/login.html';
            return;
        }

        // Guardar el ID del usuario logueado
        usuarioId = data.usuario.id;

        // Mostrar su nombre en algún lado si quieres
        $('#navbarUsername').text(data.usuario.nombre);
        $('#navbarUserType').text('(Cliente)');
    })
    .fail(function() {
        window.location.href = '../pages/login.html';
    });

    // Capturar envío del formulario de mascota
    $('#formMascota').on('submit', function(event) {
        event.preventDefault();

        if (!usuarioId) {
            alert("Error: no se ha podido identificar al usuario.");
            return;
        }

        // Obtener los datos del formulario
        const formData = {
            usuario_id: usuarioId,
            nombre: $('input[name="nombre"]').val(),
            especie: $('input[name="especie"]').val(),
            raza: $('input[name="raza"]').val(),
            fecha_nacimiento: $('input[name="fecha_nacimiento"]').val()
        };

        // Validar campos básicos antes de enviar
        if (!formData.nombre || !formData.especie || !formData.fecha_nacimiento) {
            alert("Por favor completa los campos obligatorios.");
            return;
        }

        // Enviar los datos al backend
        $.ajax({
            url: '../../backend/api/registrar_mascota_string.php',
            method: 'POST',
            data: formData,
            dataType: 'json'
        })
        .done(function(response) {
            if (response.success) {
                alert("Mascota registrada con éxito.");
                $('#formMascota')[0].reset();
            } else {
                alert("" + response.message);
            }
        })
        .fail(function(xhr) {
            alert("Error al registrar la mascota: " + xhr.responseText);
        });
    });
});
