const razasPorEspecie = {
            "1": [ // Perro
                { id: "101", nombre: "Labrador" },
                { id: "102", nombre: "Bulldog" },
                { id: "103", nombre: "Pastor Alemán" },
                { id: "199", nombre: "Mestizo (Perro)" }
            ],
            "2": [ // Gato
                { id: "201", nombre: "Siamés" },
                { id: "202", nombre: "Persa" },
                { id: "299", nombre: "Mestizo (Gato)" }
            ],
            "3": [ // Ave
                { id: "301", nombre: "Canario" },
                { id: "302", nombre: "Perico" }
            ],
            "4": [ // Hámster (Roedor)
                { id: "401", nombre: "Sirio (Dorado)" },
                { id: "402", nombre: "Ruso (Campbell)" },
                { id: "403", nombre: "Roborovski" },
                { id: "404", nombre: "Chino" }
            ],
            "5": [ // Reptil
                { id: "501", nombre: "Tortuga de Orejas Rojas" },
                { id: "502", nombre: "Gecko Leopardo" },
                { id: "503", nombre: "Iguana Verde" },
                { id: "504", nombre: "Pitón Bola" },
                { id: "505", nombre: "Dragón Barbudo" }
            ]
        };

        function checkOtraEspecie() {
            const especieVal = $('#especie').val();
            const $divOtro = $('#div_especie_otra');
            const $inputOtro = $('#especie_otra');

            if (especieVal === 'otro') {
                $divOtro.show(); 
                $inputOtro.prop('required', true);
            } else {
                $divOtro.hide(); 
                $inputOtro.prop('required', false).val(''); 
            }
        }

        function actualizarRazas() {
            const especieId = $('#especie').val();
            const $selectRaza = $('#raza');

            $selectRaza.empty().append($('<option>', {
                value: '',
                text: '-- Seleccione una raza --'
            }));

            // Si se seleccionó una especie válida (y no es "otro")
            if (especieId && especieId !== 'otro' && razasPorEspecie[especieId]) {
                const razas = razasPorEspecie[especieId];
                
                $.each(razas, function(index, raza) {
                    $selectRaza.append($('<option>', {
                        value: raza.id,
                        text: raza.nombre
                    }));
                });
            }

            // Añadir siempre la opción "Otra" al final (si no se eligió "otra" especie)
            if (especieId && especieId !== 'otro') {
                $selectRaza.append($('<option>', {
                    value: 'otro',
                    text: 'Otra (Especifique)'
                }));
            } else if (especieId === 'otro') {
                $selectRaza.html('<option value="otro">-- Especifique raza abajo --</option>');
                $selectRaza.val('otro');
                checkOtraRaza(); 
            }
        }

        function checkOtraRaza() {
            const razaVal = $('#raza').val();
            const $divOtro = $('#div_raza_otra');
            const $inputOtro = $('#raza_otra');

            if (razaVal === 'otro') {
                $divOtro.show();
                $inputOtro.prop('required', true);
            } else {
                $divOtro.hide();
                $inputOtro.prop('required', false).val('');
            }
        }

        $(document).ready(function() {
            $('#div_especie_otra').hide();
            $('#div_raza_otra').hide();

            $('#especie').on('change', function() {
                checkOtraEspecie();
                actualizarRazas();
            });

            $('#raza').on('change', function() {
                checkOtraRaza();
            });

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

                if (result.success) {
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
