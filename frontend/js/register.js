$('#registerForm').on('submit', function(e) {
  e.preventDefault();
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
        setTimeout(() => window.location.href = 'login.html', 500);
      }
    },
    error: function() {
      alert('Ocurrió un error al intentar registrar el usuario.');
    }
  });
});