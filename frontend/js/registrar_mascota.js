
        $(document).ready(function() {
            
        });

        $('#registrarMascotaForm').on('submit', function(e) {
            e.preventDefault();
            
            const btn = $(this).find('button[type="submit"]');
            $.ajax({
                url: $(this).attr('action'),
                type: 'POST',
                data: $(this).serialize(),
                dataType: 'json',
                success: function(result) {
                const msgDiv = $('#responseMessage');
                msgDiv.text(result.message)
                        .removeClass('text-success text-danger')
                        .addClass(result.success ? 'text-success' : 'text-danger');

                if (response.success) {
                    alert("Mascota registrada con éxito.");
                    $('#formMascota')[0].reset();
                } else {
                    alert("" + response.message);
                }
                },
                error: function() {
                alert('Error al registrar mascota');
                },
                complete: function() {
                btn.prop('disabled', false).text('Registrar');
                }
            });
        });
