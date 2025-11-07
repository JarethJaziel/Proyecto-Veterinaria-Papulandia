$(document).ready(function() {
    // Verificar sesión
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

        const usuario = data.usuario;
        $('#navbarUsername').text(usuario.nombre);
        $('#navbarUserType').text('(Cliente)');

        // Cargar mascotas del cliente
$.ajax({
    url: '../../backend/api/getMascotasCliente.php',
    method: 'GET',
    dataType: 'json',
    xhrFields: { withCredentials: true }
})
.done(function(mascotas) {
    const petsContainer = $('.pets-section .row');
    const noPetsMessage = $('#no-pets-message');

    // Limpiar lo anterior
    petsContainer.empty();

    if (mascotas.length === 0) {
        // No tiene mascotas
        petsContainer.hide();
        noPetsMessage.show();
    } else {
        // Tiene mascotas
        noPetsMessage.hide();
        petsContainer.show();

        mascotas.forEach(mascota => {
            const citaTexto = mascota.proxima_cita === 'Sin asignar'
                ? '<small class="text-muted">Sin asignar</small>'
                : `<small class="text-success">${mascota.proxima_cita}</small>`;

            const petCard = `
                <div class="col-md-6">
                    <div class="pet-card d-flex align-items-center">
                        <div class="pet-avatar">
                            <i class="fas fa-paw"></i>
                        </div>
                        <div>
                            <h5 class="mb-1">${mascota.nombre_mascota}</h5>
                            <p class="text-muted mb-1">${mascota.raza} • ${mascota.especie}</p>
                            ${citaTexto}
                        </div>
                    </div>
                </div>
            `;
            petsContainer.append(petCard);
        });
    }
})
.fail(function(err) {
    console.error("Error al obtener las mascotas del cliente:", err);
});

    })
    .fail(function() {
        window.location.href = '../pages/login.html';
    });
});

