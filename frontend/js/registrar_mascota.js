
        $(document).ready(function() {
          $('#formMascota').on('submit', function(e) {
            e.preventDefault();
            
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
                alert('Error al registrar mascota');
                },
                complete: function() {
                btn.prop('disabled', false).text('Registrar');
                }
            });
            
        });
  
        });

        