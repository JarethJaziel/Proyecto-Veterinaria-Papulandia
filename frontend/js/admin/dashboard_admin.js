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

        // Insertar datos en el dashboard
        $(".stat-appointments").text(response.citas_hoy);
        $(".stat-clients").text(response.clientes);
        $(".stat-pets").text(response.mascotas);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error AJAX:", textStatus, errorThrown);
    });

});
