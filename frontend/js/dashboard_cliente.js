
$(document).ready(function() {

    // Llamada AJAX para cargar las mascotas del cliente
    $.ajax({
        url: RUTA_BASE + 'backend/controllers/dashboard_clienteController.php',
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

            const mapaMascotas = new Map();

    mascotas.forEach((item, index) => {
        // DEBUG: mostrar lo que llega por fila
        console.log(`[fila ${index}] objeto mascota:`, item);

        // Normalizar id tomando varias propiedades posibles
        const possibleIds = ['id', 'mascota_id', 'ID', 'MascotaId', 'Mascota_id'];
        let id = null;
        for (let k = 0; k < possibleIds.length; k++) {
            const key = possibleIds[k];
            if (Object.prototype.hasOwnProperty.call(item, key) && item[key] != null && item[key] !== '') {
                id = item[key];
                break;
            }
        }
        // Si no encontramos id explícito, intentar con index (solo para evitar collapses)
        if (id === null || id === undefined) {
            console.warn(`Fila ${index} no tiene id válido. Valores:`, item);
            // asignamos una clave única basada en índice para que no colapse con undefined
            id = `__noid_${index}`;
        }

        // Normalizar otros campos
        const nombre = item.nombre ?? item.Nombre ?? '';
        const especie = item.especie ?? item.especie_tipo ?? item.especie_tipo ?? '';
        const raza = item.raza ?? item.Raza ?? '';
        const proxima = item.proxima_cita ?? item.proxima ?? null;

        // Añadir/actualizar entrada en el mapa
        if (!mapaMascotas.has(id)) {
            mapaMascotas.set(id, {
                id,
                nombre,
                especie,
                raza,
                proxima_cita: proxima
            });
        } else {
            // actualizar proxima_cita si la nueva es más próxima
            const actual = mapaMascotas.get(id);
            if (proxima) {
                if (!actual.proxima_cita) {
                    actual.proxima_cita = proxima;
                } else {
                    const fechaNueva = new Date(proxima);
                    const fechaActual = new Date(actual.proxima_cita);
                    if (!isNaN(fechaNueva) && (isNaN(fechaActual) || fechaNueva < fechaActual)) {
                        actual.proxima_cita = proxima;
                    }
                }
                mapaMascotas.set(id, actual);
            }
        }

        // --- Generar tarjeta de cita por cada fila (igual que antes) ---
        if (proxima !== null) {
            const citasCard = `
                <div class="col-md-6">
                    <div class="pet-card">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="mb-0">${nombre}</h5>
                            <span class="badge bg-info">Programada</span>
                        </div>
                        <p class="text-muted mb-2"><i class="fas fa-paw me-2"></i>${especie}</p>
                        <p class="text-muted mb-2"><i class="fas fa-calendar me-2"></i>${proxima}</p>
                        <p class="text-muted mb-0"><i class="fas fa-user-md me-2"></i>Jareth Moo Jaziel</p>
                    </div>
                </div>
            `;
            citasContainer.append(citasCard);
        }
    });

    // DEBUG: ver cuántas entradas hay en el mapa y sus claves
    console.log('Mapa mascotas keys:', Array.from(mapaMascotas.keys()));
    console.log('Mapa mascotas entries:', Array.from(mapaMascotas.values()));

    // Ahora renderizamos una tarjeta de mascota por cada entrada del mapa
    mapaMascotas.forEach(mascota => {
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
                
            });
        }

    })
    .fail(function() {
        console.error('Error al cargar las mascotas.');
    });

});
