$(document).ready(function () {

    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=get_admin_stats",
        method: "GET",
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
    .done(function (response) {

        if (!response.success) {
            console.error("Error:", response.message);
            return;
        }

        $(".stat-appointments").text(response.citas_proximas);
        $(".stat-clients").text(response.clientes);
        $(".stat-pets").text(response.mascotas);

        const tbody = $("#tablaCitasBody");
        tbody.empty();
        if (response.lista_citas && response.lista_citas.length > 0) {
            
            response.lista_citas.forEach(cita => {
                // Lógica para color del estado (opcional)
                let estadoClass = 'bg-secondary';
                let estadoTexto = cita.estado || 'Pendiente';

                if(estadoTexto === 'Confirmada') estadoClass = 'bg-success';
                if(estadoTexto === 'Cancelada') estadoClass = 'bg-danger';

                // Construimos la fila
                let fila = `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="ms-3">
                                    <strong>${cita.nombre_usuario} ${cita.apellido_usuario}</strong>
                                    <div class="text-muted small">${cita.email_usuario || 'Sin correo'}</div>
                                </div>
                            </div>
                        </td>
                        <td>${cita.nombre_mascota}</td> <td>${cita.fecha}</td>
                        <td>${cita.motivo}</td>
                        <td><span class="badge ${estadoClass} text-white p-2">${estadoTexto}</span></td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary me-1 btn-editar-cita" data-id="${cita.cita_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger btn-eliminar-cita" data-id="${cita.cita_id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(fila);
            });

        } else {
            // Si no hay citas, mostrar mensaje
            tbody.append('<tr><td colspan="6" class="text-center text-muted">No hay citas recientes.</td></tr>');
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error AJAX:", textStatus, errorThrown);
    });

});
