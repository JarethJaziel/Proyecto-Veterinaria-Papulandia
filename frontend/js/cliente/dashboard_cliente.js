$(document).ready(function() {

     $.ajax({
        url: RUTA_BASE + 'backend/api/api.php?action=get_client_pets',
        method: 'GET',
        dataType: 'json',
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {
        if (!response.success) {
            console.error('Error:', response.message);
            return;
        }

        const mascotas = response.mascotas; 
        const petsContainer = $('.pets-section .row');
        const noPetsMessage = $('#no-pets-message');
        const citasContainer = $('.citas-section .row');
        const noCitasMessage = $('#no-appointments-message');
        
        petsContainer.empty();
        citasContainer.empty();

        // 2. MANEJAR EL CASO DE "CERO MASCOTAS"
        if (mascotas.length === 0) {
            noPetsMessage.show();
            petsContainer.hide();
            noCitasMessage.show();
            citasContainer.hide();
        } else {
            // 3. CASO "CON MASCOTAS"
            noPetsMessage.hide();
            petsContainer.show();
            
            let citasEncontradas = 0;

            mascotas.forEach(mascota => {
                
                // --- A. PINTAR LA TARJETA DE MASCOTA (SIEMPRE) ---
                const petCard = `
                    <div class="col-md-6">
                        <div class="pet-card d-flex align-items-center">
                            <div class="pet-avatar">
                                <i class="fas fa-${(mascota.especie && mascota.especie.toLowerCase() === 'gato') ? 'cat' : 'dog'}"></i>
                            </div>
                            <div>
                                <h5 class="mb-1">${mascota.nombre}</h5>
                                <p class="text-muted mb-1">${mascota.raza || ''} • ${mascota.especie || ''}</p>
                                <small class="text-success">
                                    Próxima cita el: ${mascota.proxima_cita ?? 'Sin citas próximas'}
                                </small>
                            </div>
                        </div>
                    </div>
                `;
                petsContainer.append(petCard);

                // --- B. PINTAR LA TARJETA DE CITA (SOLO SI EXISTE) ---
                if (mascota.proxima_cita) {
                    citasEncontradas++; // ¡Encontramos una!

                    const citasCard = `
                        <div class="col-md-6">
                            <div class="pet-card">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="mb-0">${mascota.nombre}</h5>
                                    <span class="badge bg-info">Programada</span>
                                </div>
                                <p class="text-muted mb-2"><i class="fas fa-paw me-2"></i>${mascota.especie}</p>
                                <p class="text-muted mb-2"><i class="fas fa-calendar me-2"></i>${mascota.proxima_cita}</p>
                                <p class="text-muted mb-0"><i class="fas fa-user-md me-2"></i>Jareth Moo Jaziel</p>
                            </div>
                        </div>
                    `;
                    citasContainer.append(citasCard);
                }
            }); // <-- Fin del forEach

            // (Podemos tener mascotas, pero 0 citas)
            if (citasEncontradas === 0) {
                noCitasMessage.show();
                citasContainer.hide();
            } else {
                noCitasMessage.hide();
                citasContainer.show();
            }
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fatal de AJAX:', textStatus, errorThrown);
    });
});