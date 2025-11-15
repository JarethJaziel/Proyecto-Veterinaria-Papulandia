 $(document).ready(function() {
            // visibilidad de contraseña
            $('#togglePassword').click(function() {
                const passwordField = $('#password');
                const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
                passwordField.attr('type', type);
                
                
                $(this).find('i').toggleClass('fa-eye fa-eye-slash');
            });
            
            // iniciar sesión con Google
            $('.btn-google').click(function() {
                alert('Redirigiendo a Google para autenticación...');
                // falta agregar esta cosa, suerte jareth 
            });
            
            // Cuando le picas se cambia el color del borde
            $('.form-control').focus(function() {
                $(this).parent().addClass('focused');
            }).blur(function() {
                $(this).parent().removeClass('focused');
            });

            $('#registerForm').on('submit', function(e) {
            e.preventDefault();
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
                  setTimeout(() => window.location.href = 'pages/login.html', 500);
                }
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  console.error("AJAX falló. Razón: " + textStatus); // <-- Esto dirá 'parsererror'
                  console.error("Respuesta del servidor (lo que rompió el JSON):");
                  console.error(jqXHR.responseText); // <-- Esto imprimirá el Warning o el espacio en blanco
                  
                  alert('Ocurrió un error. Revisa la consola (F12) para detalles.');
              }
            });
          });
        });