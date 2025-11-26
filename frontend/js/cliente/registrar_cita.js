    $(document).ready(function() {

        function cargarHoras() {
                const select = $("#hora");
                select.empty();

                const inicio = 8 * 60; // 8:00
                const fin = 17 * 60;   // 17:00

                for (let min = inicio; min <= fin; min += 30) {
                    const h = String(Math.floor(min / 60)).padStart(2, "0");
                    const m = String(min % 60).padStart(2, "0");
                    const hora = `${h}:${m}`;

                    select.append(`<option value="${hora}">${hora}</option>`);
                }
            }

            cargarHoras(); 

        $('#formCita').on('submit', function(e) {
                e.preventDefault();
                console.log($(this).serialize());
                const btn = $(this).find('button[type="submit"]');
                $.ajax({
                    url: RUTA_BASE + $(this).attr('action'),
                    type: 'POST',
                    data: $(this).serialize(),
                    dataType: 'json',
                    success: function(result) {
                    const msgDiv = $('#responseMessage');
                    msgDiv.text(result.message)
                            .removeClass('text-success text-danger')
                            .addClass(result.success ? 'text-success' : 'text-danger');

                    if (result.success) {
                        const toPath = 'pages/cliente/dashboard_cliente'+'.html';
                        setTimeout(() => window.location.href = toPath, 500);
                        //dar o no success
                        
                    }
                    },
                    error: function(xhr) {
                        let msg = "Error desconocido.";

                        try {
                            // Intentar leer el JSON del backend
                            const json = JSON.parse(xhr.responseText);
                            msg = json.message ?? msg;
                        } catch (e) {
                            console.error("No se pudo parsear JSON del error", e);
                        }

                        // Mostrar mensaje en pantalla
                        const msgDiv = $('#responseMessage');
                        msgDiv.text(msg)
                            .removeClass('text-success')
                            .addClass('text-danger');
                    },
                    complete: function() {
                    btn.prop('disabled', false).text('Registrar');
                    }
                });
                
            });

            
        // Llamada AJAX para cargar las mascotas del cliente
        $.ajax({
            url: RUTA_BASE + 'backend/api/api.php?action=get_client_pets',
            method: 'GET',
            dataType: 'json',
            xhrFields: { withCredentials: true }
        })
        .done(function(response) {
            // Verificamos si la respuesta fue exitosa
            if (!response.success) {
                console.error('Error:', response.message);
                return;
            }

            const mascotas = response.mascotas; // Array de mascotas
            const petsContainer = $('#mascota_id');
        

            
            // Limpiar el contenedor por si acaso
            petsContainer.find('option:not([disabled])').remove();
            

        

                // Iterar y crear una tarjeta por cada mascota
            const nombresUnicos = new Set();

    mascotas.forEach(mascota => {
        // Si el nombre ya se agregó, se salta
        if (nombresUnicos.has(mascota.nombre)) return;

        nombresUnicos.add(mascota.nombre);

        const option = `
            <option value="${mascota.id}" data-especie="${mascota.especie}">
                ${mascota.nombre}
            </option>
        `;
        petsContainer.append(option);
    });
            

        })
        .fail(function() {
            console.error('Error al cargar las mascotas.');
        });



        $("#mascota_id").on("change", function() {
            const especie = $(this).find(":selected").data("especie") || "";
            $("#especie").val(especie);
        });
    });
