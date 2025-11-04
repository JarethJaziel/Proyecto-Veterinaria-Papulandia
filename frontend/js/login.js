$('#loginForm').on('submit', function(e) {
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

      if (result.success) {
        const toPath = 'dashboard_'+result.tipo+'.html';
        setTimeout(() => window.location.href = toPath, 500);
      }
    },
    error: function() {
      alert('Ocurrió un error al iniciar sesión.');
    },
    complete: function() {
      btn.prop('disabled', false).text('Iniciar sesión');
    }
  });
});


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
        });