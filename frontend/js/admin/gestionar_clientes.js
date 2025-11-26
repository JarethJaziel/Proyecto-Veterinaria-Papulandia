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
                        <button class="btn btn-success btn-sm" onclick="verMascotas(${cli.id}, '${cli.nombre}')" title="Ver Mascotas">
                            <i class="fas fa-paw"></i> Mascotas
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
        let id = $('#id_cliente').val();
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

function verMascotas(clienteId, clienteNombre) {
    $("#modalMascotas").data("cliente-id", clienteId);
    $("#modalMascotas").data("cliente-nombre", clienteNombre);
    console.log("Ver mascotas del cliente ID:", clienteId);
    $.ajax({
        url: RUTA_BASE + 'backend/api/api.php?action=get_client_pets',
        method: 'POST',
        data: { cliente_id: clienteId },
        dataType: 'json',
        success: function(result) {
            const msgDiv = $('#responseMessageCliente');
            msgDiv.text(result.message)
                    .removeClass('text-success text-danger')
                     .addClass(result.success ? 'text-success' : 'text-danger');
            if (result.success) {
                $('#nombreClienteMasc').text(`Mascotas de ${clienteNombre}`);
                cargarMascotasEnModal(result.mascotas);
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
            
        }
    });
}

function cargarMascotasEnModal(mascotas) {

    const contenedor = $('#contenedorMascotas');

    contenedor.empty();

    if (!mascotas || mascotas.length === 0) {
        contenedor.append('<div class="col-12 text-center text-muted">No hay mascotas registradas.</div>');
    } else {
        mascotas.forEach(masc => {
            let cardHTML = `
                <div class="col-6 col-md-4">
                    <div class="card h-100 shadow-sm select-mascota-card" style="cursor:pointer;" data-id="${masc.id}">
                        <button class="btn btn-sm btn-danger delete-mascota-btn" 
                                style="position:absolute; top:5px; right:5px; z-index:10;"
                                data-id="${masc.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                        <div class="card-body p-2 text-center">
                            <h6 class="card-title mb-1 fw-bold">${masc.nombre}</h6>
                            <small class="text-muted">${masc.especie || 'Sin raza'}</small>
                            <small class="text-muted">${masc.raza || 'Sin raza'}</small>
                            
                        </div>
                    </div>
                </div>
            `;

            contenedor.append(cardHTML);
        });
    }

    $('#modalMascotas').modal("show");   
}

$(document).on("click", ".delete-mascota-btn", function() {

    const idMascota = $(this).data("id");

    if (!confirm("¿Seguro que deseas eliminar esta mascota? Se eliminarán las citas y el historial de la mascota.")) return;

    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=delete_pet",
        type: "POST",
        data: { pet_id: idMascota },
        dataType: "json",

        success: function(response) {
            if (response.success) {
                alert("Mascota eliminada correctamente");
                const modal = $("#modalMascotas");
                const clienteId = modal.data("cliente-id");
                const clienteNombre = modal.data("cliente-nombre");

                verMascotas(clienteId, clienteNombre);
            } else {
                alert(response.message);
            }
        },

        error: function(xhr) {
            console.error(xhr.responseText);
            alert("Error al intentar eliminar la mascota.");
        }
    });
});

function verCliente(modo, id = null, nombre = null, apellidos = null, correo = null, telefono = null) {

    $('#responseMessageCliente').text('').removeClass('text-success text-danger');

    $("#formCliente")[0].reset();
    
    $("#id_cliente").val(id); 
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

window.eliminarCliente = function(id) {

    if (!confirm("¿Seguro que deseas eliminar este cliente? También se eliminarán sus mascotas, citas e historial.")) {
        return;
    }

    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=delete_user",
        method: "POST",
        data: { id: id },
        dataType: "json"
    })
    .done(function(response) {

        if (response.success) {
            alert(response.message);
            location.reload();  // recarga para actualizar lista
        } else {
            alert("Error: " + response.message);
        }
    })
    .fail(function(xhr) {
        console.error("Respuesta del servidor:", xhr.responseText);
        alert("No se pudo completar la petición.");
    });

};


