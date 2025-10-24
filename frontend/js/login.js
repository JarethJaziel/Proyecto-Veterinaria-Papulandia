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
        const toPath = '../../backend/views/dashboard_'+result.tipo+'.php';
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