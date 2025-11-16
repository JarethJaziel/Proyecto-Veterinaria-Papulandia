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

            // ----------------------------
            // VALIDACIONES ANTES DE ENVIAR
            // ----------------------------
            $('#registerForm').on('submit', function(e) {

                const msgDiv = $('#responseMessage');
                msgDiv.removeClass('text-success text-danger').text("");

                // --------- Validar apellidos: EXACTAMENTE 2 ---------
                const apellidos = $('#apellidos').val().trim();
                const partes = apellidos.split(/\s+/);

                if (partes.length !== 2) {
                    e.preventDefault();
                    msgDiv.text('Debes ingresar exactamente dos apellidos.')
                          .addClass('text-danger');
                    return;
                }

                // --------- Validar correo ---------
                const email = $('#email').val().trim();
                const regexCorreo = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (!regexCorreo.test(email)) {
                    e.preventDefault();
                    msgDiv.text('Por favor ingresa un correo electrónico válido.')
                          .addClass('text-danger');
                    return;
                }

                // Si llegan aquí, NO detenemos el form → entra AJAX
                e.preventDefault();

                $.ajax({
                    url: $(this).attr('action'),
                    type: 'POST',
                    data: $(this).serialize(),
                    dataType: 'json',

                    success: function(result) {
                        msgDiv.text(result.message)
                              .removeClass('text-success text-danger')
                              .addClass(result.success ? 'text-success' : 'text-danger');

                        if (result.success) {
                            setTimeout(() => window.location.href = 'login.html', 500);
                        }
                    },

                    error: function(jqXHR, textStatus) {
                        console.error("AJAX falló. Razón: " + textStatus);
                        console.error("Respuesta del servidor:");
                        console.error(jqXHR.responseText);

                        alert('Ocurrió un error. Revisa consola para más detalles.');
                    }
                });
            });
        });