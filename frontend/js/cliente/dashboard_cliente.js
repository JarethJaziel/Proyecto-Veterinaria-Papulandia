$(document).ready(function() {

     $.ajax({
        url: RUTA_BASE + 'backend/api/api.php?action=get_client_dashboard',
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
                            <button class="btn btn-sm btn-outline-info ms-auto" onclick="verHistorial(${mascota.id})">
                                <i class="fas fa-file-medical"></i> Historial
                            </button>
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

    $('#btnImprimirHistorial').on('click', function() {
        imprimirHistorial();
    });
});

function verHistorial(idMascota) {
    // 1. Limpiar tabla anterior
    $('#tablaHistorialBody').empty();
    $('#modalHistorial').modal('show');
    
    // 2. Hacer la petición AJAX
    $.ajax({
        url: RUTA_BASE + 'backend/api/api.php?action=get_pet_history',
        type: 'GET',
        data: {mascota_id: idMascota },
        success: function(response) {
            
            if(response.data.length > 0) {
                 response.data.forEach(hist => {
                     $('#tablaHistorialBody').append(`
                        <tr>
                            <td>${hist.fecha}</td>
                            <td>${hist.procedimiento}</td>
                            <td>Dr. Jareth</td>
                        </tr>
                     `);
                 });
            } else {
                 $('#tablaHistorialBody').append('<tr><td colspan="5" class="text-center">Sin historial disponible</td></tr>');
            }
        },
        error: function() {
            alert('Error al cargar historial');
        }
    });
}

function imprimirHistorial() {
    // 1. Obtener el contenido de la tabla
    const contenidoTabla = document.getElementById('tablaHistorialBody').parentNode.outerHTML;
    
    // 2. Obtener el nombre de la mascota (ajusta el selector según donde lo tengas en tu modal)
    // Opción A: Si lo pusiste en el título del modal, por ejemplo
    // Opción B: Si lo tienes en una variable global cuando abriste el modal (ej: nombreMascotaActual)
    // Aquí asumo que hay un elemento con id "nombreMascotaModal" o simplemente ponemos un título genérico
    const fechaImpresion = new Date().toLocaleDateString();

    // 3. Abrir ventana nueva
    const ventana = window.open('', 'PRINT', 'height=600,width=800');

    ventana.document.write('<html><head><title>Historial Médico - Papulandia</title>');
    
    // IMPORTANTE: Incluimos Bootstrap para que la tabla no se vea fea y sin formato
    ventana.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">');
    
    ventana.document.write('<style>');
    ventana.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    ventana.document.write('.header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0dcaf0; padding-bottom: 10px; }');
    ventana.document.write('</style>');
    ventana.document.write('</head><body>');

    // 4. Construir el contenido visible
    ventana.document.write('<div class="header">');
    ventana.document.write('<h1>Veterinaria Papulandia</h1>');
    ventana.document.write('<h4>Reporte de Historial Médico</h4>');
    ventana.document.write('<p>Fecha de emisión: ' + fechaImpresion + '</p>');
    ventana.document.write('</div>');

    ventana.document.write('<h5>Detalle de Consultas:</h5>');
    ventana.document.write(contenidoTabla); // Aquí pegamos la tabla

    ventana.document.write('<div style="margin-top:50px; text-align:center; font-size:12px; color:#666;">Documento generado automáticamente por el sistema de Papulandia.</div>');

    ventana.document.write('</body></html>');

    ventana.document.close(); // Necesario para terminar de cargar
    ventana.focus(); // Enfocar la ventana

    // 5. Esperar un momento a que carguen los estilos y ejecutar imprimir
    setTimeout(function() {
        ventana.print();
        ventana.close();
    }, 1000); // 1 segundo de espera para asegurar que cargue Bootstrap
}