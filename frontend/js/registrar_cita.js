$(document).ready(function() {
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
                error: function() {
                alert('Error al agendar cita');
                },
                complete: function() {
                btn.prop('disabled', false).text('Registrar');
                }
            });
            
        });




    // Llamada AJAX para cargar las mascotas del cliente
    $.ajax({
        url: RUTA_BASE + 'backend/controllers/dashboard_clienteController.php',
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
        petsContainer.empty();
        

    

            // Iterar y crear una tarjeta por cada mascota
            const nombresUnicos = new Set();

mascotas.forEach(mascota => {
    // Si el nombre ya se agregó, se salta
    if (nombresUnicos.has(mascota.nombre)) return;

    nombresUnicos.add(mascota.nombre);

    const option = `
        <option value="${mascota.mascota_id}" data-especie="${mascota.especie}">
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
