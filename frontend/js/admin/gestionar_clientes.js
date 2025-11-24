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
        e.preventDefault();
        const btn = $(this).find('button[type="submit"]')
        let id = $('#id').val(); 
        console.log("ID del cliente:", id);
        let action = id ? 'update_user' : 'register_user';

        $.ajax({
            url: RUTA_BASE + $(this).attr('action') + '?action=' + action,
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(result) {
                const msgDiv = $('#responseMessageCliente');
                msgDiv.text(result.message)
                        .removeClass('text-success text-danger')
                        .addClass(result.success ? 'text-success' : 'text-danger');
                if (result.success) {
                    setTimeout(() => location.reload(), 500);
                }
            },
            error: function(xhr) {
                let msg = "Error desconocido.";
                try {
                    const json = JSON.parse(xhr.responseText);
                    msg = json.message ?? msg;
                } catch (e) {
                    console.error("No se pudo parsear JSON del error", e);
                }
                const msgDiv = $('#responseMessageCliente');
                msgDiv.text(msg)
                    .removeClass('text-success')
                    .addClass('text-danger');
            },
            complete: function() {
                btn.prop('disabled', false).text('Guardar');
            }
        });
    });

});

function verMascotas(clienteId) {

}

function verCliente(modo, id = null, nombre = null, apellidos = null, correo = null, telefono = null) {

    $("#formCliente")[0].reset();
    
    $("#clienteId").val(id); 
    console.log($("#clienteId").val());
    // Si es nuevo
    if (modo === "nuevo") {
        $(".contraseña-group").remove(); 
        
        const inputPass = `
            <div class="mb-3 contraseña-group">
                <label for="password" class="form-label">Contraseña:</label>
                <input type="password" id="password" name="password" class="form-control" required>
            </div>
        `;

        $("#telefono").closest(".mb-3").after(inputPass);

        $(".modal-title").text("Registrar Cliente");
        $("#guardarCliente").val("Registrar");
    }

    if (modo === "editar") {
        $("#nombres").val(nombre);
        $("#apellidos").val(apellidos);
        $("#email").val(correo);
        $("#telefono").val(telefono ?? "");

        $(".contraseña-group").remove(); 

        $(".modal-title").text("Editar Cliente");
        $("#guardarCliente").val("Actualizar");
    }

    // Borra todo lo relacionado a "new bootstrap.Modal(...)" y pon esto:
    $("#modalCliente").modal("show");
}
