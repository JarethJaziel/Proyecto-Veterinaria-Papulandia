$(document).ready(function () {


    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=get_all_citas",
        method: "GET",
        dataType: "json",
        xhrFields: { withCredentials: true }
    })
        .done(function (response) {

            if (!response.success) {
                console.error("Error:", response.message);
                return;
            }
            alert(JSON.stringify(response, null, 2));
            /*
            response.clientes.forEach(cli => {
                alert(cli.nombre)
            });
              */

            const container = $('#contenedorCitas');
            container.empty();
            response.citas.forEach(cita => {

                const citasCard = `
    <div class="col-12 my-3">
        <div class="pet-card cita-card p-3">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="mb-0">${cita.nombre_usuario}</h5>
                <span class="badge bg-warning text-dark">Pendiente</span>
            </div>

            <p class="text-muted mb-2">
                <i class="fas fa-paw me-2"></i>${cita.nombre_mascota}
            </p>

            <p class="text-muted mb-2">
                <i class="fas fa-calendar me-2"></i>${cita.fecha}
            </p>

            <p class="text-muted mb-2">
                <i class="fas fa-info-circle me-2"></i><strong>Motivo:</strong> ${cita.motivo ?? "Sin especificar"}
            </p>

            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-outline-primary btn-sm btnHistorial smooth-btn" data-id="${cita.cita_id}" id="btnHistorial">
                    Ver historial
                </button>
                <button class="btn btn-primary btn-sm btnProcedimiento smooth-btn" data-id="${cita.cita_id}" id="btnProcedimiento">
                    Agregar procedimiento
                </button>
            </div>
        </div>
    </div>
`;



                container.append(citasCard);
            });




        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Error AJAX:", textStatus, errorThrown);
        });













    // Abrir modal historial
    $(document).on("click", "#btnHistorial", function () {
        $("#modalHistorial").modal("show");
    });

    // Abrir modal agregar procedimiento
    $(document).on("click", "#btnProcedimiento", function () {
        $("#modalAgregarProcedimiento").modal("show");
    });

});
