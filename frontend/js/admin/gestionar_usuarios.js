$(document).ready(function() {
    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=get_all_users",
        method: "GET",
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {
        if (!response.success) {
            console.error("Error:", response.message);
            return;
        }
        const tbody = $("#tablaUsuarios");
        tbody.empty();
        response.usuarios.forEach(user => {
            const fila = `
                <tr>
                    <td>${user.nombre} ${user.apellidos}</td>
                    <td>${user.correo}</td>
                    <td>${user.tipo}</td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-sm"
                            onclick="switchUserType(${user.id}, '${user.tipo}')">
                            <i class="fas fa-exchange-alt"></i> Cambiar Rol
                        </button>

                        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})" title="Eliminar Usuario">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(fila);
        });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error AJAX:", textStatus, errorThrown);
    });
});

function switchUserType(userId, currentType) {
    const modal = abrirModal(
        "Confirmar cambio de rol",
        "¿Seguro que deseas cambiar de rol?",
        [
            { id: "cancelar", text: "Cancelar", class: "btn-secondary" },
            { id: "confirmar", text: "Cambiar", class: "btn-primary" }
        ]
    );

    // Esperar clic en ELIMINAR
    $(document).off("click", "#confirmar").on("click", "#confirmar", function () {
        modal.hide();
        confirmSwitchUser(userId,currentType);
    });

    $(document).off("click", "#cancelar") .on("click", "#cancelar", function () {
        modal.hide(); // cerrar modal
    });
    
}

function deleteUser(userId) {

    const modal = abrirModal(
        "Confirmar eliminación",
        "¿Seguro que deseas eliminar este cliente? <br> También se eliminarán sus mascotas, citas e historial.",
        [
            { id: "cancelar", text: "Cancelar", class: "btn-secondary" },
            { id: "confirmar", text: "Eliminar", class: "btn-danger" }
        ]
    );

    // Esperar clic en ELIMINAR
    $(document).off("click", "#confirmar").on("click", "#confirmar", function () {
        modal.hide();
        confirmDeleteuser(userId);
    });

    $(document).off("click", "#cancelar") .on("click", "#cancelar", function () {
        modal.hide(); // cerrar modal
    });

}


function confirmDeleteUser(userId) {

    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=delete_user",
        method: "POST",
        data: { id: userId },
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {

        abrirModal(
            response.success ? "Usuario eliminado" : "Error",
            response.message,
            [{ id: "cerrar", text: "Cerrar", class: "btn-primary" }]
        );

        // recargar cuando cierre
        $(document).off("click", "#cerrar").on("click", "#cerrar", function () {
            location.reload();
        });

    })
    .fail(function() {
        abrirModal(
            "Error en la petición",
            "Hubo un problema procesando la solicitud.",
            [{ id: "cerrar", text: "Cerrar", class: "btn-primary" }]
        );
    });
}

function abrirModal(titulo, mensaje, botones = []) {
    $("#mensajeModalTitulo").html(titulo);
    $("#mensajeModalTexto").html(mensaje);

    let footer = $("#mensajeModalFooter");
    footer.empty(); // Limpiar botones anteriores

    botones.forEach(btn => {
        footer.append(`
            <button class="btn ${btn.class}" id="${btn.id}">${btn.text}</button>
        `);
    });

    let modal = new bootstrap.Modal(document.getElementById("mensajeModal"));
    modal.show();

    return modal; // devolver instancia por si se necesita
}

function confirmSwitchUser(userId, currentType) {

     const newType = currentType === 'admin' ? 'cliente' : 'admin';
    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=switch_user_type",
        method: "POST",
        data: { id: userId, new_type: newType },
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {
        abrirModal(
            response.success ? "Rol cambiado" : "Error",
            response.message,
            [{ id: "cerrar", text: "Cerrar", class: "btn-primary" }]
        );
        // recargar cuando cierre
        $(document).off("click", "#cerrar").on("click", "#cerrar", function () {
            location.reload();
        });
    })
    .fail(function() {
        abrirModal(
            "Error en la petición",
            "Hubo un problema procesando la solicitud.",
            [{ id: "cerrar", text: "Cerrar", class: "btn-primary" }]
        );
    });
}

