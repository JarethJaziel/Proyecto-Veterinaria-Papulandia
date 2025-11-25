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
                <button class="btn btn-outline-primary btn-sm btnHistorial smooth-btn" data-id="${cita.mascota_id}" id="btnHistorial">
                    Ver historial
                </button>
                <button class="btn btn-primary btn-sm btnProcedimiento smooth-btn" data-id="${cita.mascota_id}" id="btnProcedimiento">
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













    let mascotaSeleccionada = null;

    // Abrir modal historial y cargar historial
$(document).on("click", ".btnHistorial", function () {
    mascotaSeleccionada = $(this).data("id");

    $("#modalHistorial").modal("show");

    $.ajax({
        url: RUTA_BASE + "backend/api/api.php?action=view_history",
        method: "GET",
        data: { mascota_id: mascotaSeleccionada },
        dataType: "json"
    })
    .done(function (response) {
        const contenedor = $("#contenedorHistorial");
        contenedor.empty();

        if (!response.success) {
            contenedor.append(`<p class="text-danger">${response.message}</p>`);
            return;
        }

        if (response.data.length === 0) {
            contenedor.append(`<p class="text-muted">No hay historial para esta mascota.</p>`);
            return;
        }

        response.data.forEach(item => {
            const procHtml = `
                <div class="mb-3 p-3 border rounded shadow-sm bg-light">
                    <p class="mb-1"><strong>${item.fecha}</strong></p>
                    <p class="mb-0">${item.procedimiento}</p>
                </div>
            `;

            contenedor.append(procHtml);
        });

    })
    .fail(function () {
        $("#contenedorHistorial").html(`<p class="text-danger">Error al cargar historial.</p>`);
    });
});


    // Abrir modal agregar procedimiento
    $(document).on("click", ".btnProcedimiento", function () {
        mascotaSeleccionada = $(this).data("id");
        $("#modalAgregarProcedimiento").modal("show");
    });

    // Enviar procedimiento
    $(document).on("click", "#btnAgregarProcedimiento", function () {

        const procedimiento = $("#textoProcedimiento").val().trim();

        if (procedimiento.length === 0) {
            alert("El procedimiento no puede estar vacío.");
            return;
        }

        $.ajax({
            url: RUTA_BASE + "backend/api/api.php?action=register_history",
            method: "POST",
            data: {
                mascota_id: mascotaSeleccionada,
                procedimiento: procedimiento
            },
            dataType: "json"
        })
            .done(function (response) {
                if (response.success) {
                    alert("Procedimiento agregado correctamente.");
                    $("#modalAgregarProcedimiento").modal("hide");
                    $("#textoProcedimiento").val("");
                } else {
                    alert("Error: " + response.message);
                }
            })
            .fail(function () {
                alert("Error en la petición AJAX.");
            });

    });


});
