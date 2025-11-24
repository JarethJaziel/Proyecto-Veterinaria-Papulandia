$(document).ready(function () {

    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=get_all_clients",
        method: "GET",
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
    .done(function (response) {

        if (!response.success) {
            console.error("Error:", response.message);
            return;
        }

        const tbody = $("#tablaClientes");
        tbody.empty();

        response.clientes.forEach(cli => {
            const fila = `
                <tr>
                    <td>${cli.nombre} ${cli.apellidos}</td>
                    <td>${cli.correo}</td>
                    <td>${cli.telefono}</td>
                    <td class="text-center">
                        <button class="btn btn-success btn-sm" onclick="verMascotas(${cli.id})" title="Ver Mascotas">
                            <i class="fas fa-paw"></i> Mascotas
                        </button>

                        <button class="btn btn-warning btn-sm" onclick="verCitas(${cli.id})" title="Ver Historial">
                            <i class="fas fa-calendar-alt"></i> Citas
                        </button>

                        <button class="btn btn-primary btn-sm" 
                            onclick="verCliente('editar', ${cli.id}, '${cli.nombre}', '${cli.apellidos}', '${cli.correo}', '${cli.telefono}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>

                        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cli.id})" title="Eliminar Cliente">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;

            tbody.append(fila);
        });

    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error AJAX:", textStatus, errorThrown);
    });

    $('#formCliente').on('submit', function(e) {
        
    });
     

});

function verMascotas(clienteId) {

}

function verCliente(modo, id = null, nombre = null, apellidos = null, correo = null, telefono = null) {

}
