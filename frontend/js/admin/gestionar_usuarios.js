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
    const newType = currentType === 'admin' ? 'cliente' : 'admin';
    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=switch_user_type",
        method: "POST",
        data: { id: userId, new_type: newType },
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {
        if(!response.success) {
            console.error("Error:", response.message);
            return;
        }
        setTimeout(() => location.reload(), 500);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error AJAX:", textStatus, errorThrown);
    });
}

function deleteUser(userId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        return;
    }
    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=delete_user",
        method: "POST",
        data: { id: userId },
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
    .done(function(response) {
        if (!response.success) {
            console.error("Error:", response.message);
            return;
        }
        setTimeout(() => location.reload(), 500);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error AJAX:", textStatus, errorThrown);
    });
}