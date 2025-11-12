$(document).ready(function() {

    // Llamada AJAX para cargar las mascotas del cliente
    $.ajax({
        url: '../../backend/controllers/dashboard_clienteController.php',
        method: 'GET',
        dataType: 'json',
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {
        // Verificamos si la respuesta fue exitosa
        if (!response.success) {
            console.error('Error:', response.message);
            return;
        }

        const mascotas = response.mascotas; // Array de mascotas
        const petsContainer = $('.pets-section .row');
        const noPetsMessage = $('#no-pets-message');
        const citasContainer = $('.citas-section .row');
        
        const noCitasMessage = $('#no-appointments-message');

        
        // Limpiar el contenedor por si acaso
        petsContainer.empty();
        citasContainer.empty();

        if (mascotas.length === 0) {
            // No hay mascotas: mostramos el mensaje, ocultamos la sección de tarjetas
            noPetsMessage.show();
            petsContainer.hide();

            noCitasMessage.show();
            citasContainer.hide();
        } else {
            // Hay mascotas: ocultamos mensaje, mostramos tarjetas
            noPetsMessage.hide();
            petsContainer.show();

            noCitasMessage.hide();
            citasContainer.show();

            // Iterar y crear una tarjeta por cada mascota
            mascotas.forEach(mascota => {
                
                    const citasCard = `
                    <div class="col-md-6" style="display: true;">
                    <div class="pet-card">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="mb-0">${mascota.nombre}</h5>
                            <span class="badge bg-info">Programada</span>
                        </div>
                        <p class="text-muted mb-2"><i class="fas fa-paw me-2"></i>${mascota.especie}</p>
                        <p class="text-muted mb-2"><i class="fas fa-calendar me-2"></i>${mascota.proxima_cita}</p>
                        <p class="text-muted mb-0"><i class="fas fa-user-md me-2"></i>nombreDoctor</p>
                    </div>
                </div>
                `;
                if(mascota.proxima_cita != null){
                    citasContainer.append(citasCard);
                }


                const petCard = `
                    <div class="col-md-6">
                        <div class="pet-card d-flex align-items-center">
                            <div class="pet-avatar">
                                <i class="fas fa-${mascota.especie === 'gato' ? 'cat' : 'dog'}"></i>
                            </div>
                            <div>
                                <h5 class="mb-1">${mascota.nombre}</h5>
                                <p class="text-muted mb-1">${mascota.raza} • ${mascota.especie}</p>
                                <small class="text-success">Proxima cita el: ${mascota.proxima_cita ?? 'Sin citas próximas'}</small>
                            </div>
                        </div>
                    </div>
                `;
                petsContainer.append(petCard);
                
            });
        }

    })
    .fail(function() {
        console.error('Error al cargar las mascotas.');
    });

});
