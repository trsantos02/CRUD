$(document).ready(function () {
    // Máscaras de campos
    $('#cpf').mask('000.000.000-00');
    $('#cnpj').mask('00.000.000/0000-00');
    $('#cep').mask('00000-000');

    // Mostrar CPF ou CNPJ baseado na seleção
    $('#type').change(function () {
        const type = $(this).val();
        if (type === 'PF') {
            $('#cpfField').show();
            $('#cnpjField').hide();
            $('#cnpj').val(''); // Limpa o campo
        } else if (type === 'PJ') {
            $('#cnpjField').show();
            $('#cpfField').hide();
            $('#cpf').val('');
        } else {
            $('#cpfField, #cnpjField').hide();
        }
    });

    // Salvar pessoa
    $('#saveButton').click(function () {
        const person = {
            name: $('#name').val(),
            email: $('#email').val(),
            type: $('#type').val(),
            cpf_cnpj: $('#type').val() === 'PF' ? $('#cpf').val() : $('#cnpj').val(),
            cep: $('#cep').val(),
            address: $('#address').val(),
            number: $('#number').val(),
            neighborhood: $('#neighborhood').val(),
            city: $('#city').val(),
            state: $('#state').val(),
        };

        // Validação básica
      
        const persons = JSON.parse(localStorage.getItem('persons')) || [];
        persons.push(person);
        localStorage.setItem('persons', JSON.stringify(persons));

        alert('Pessoa cadastrada com sucesso!');
        clearForm();
        loadTable();
    });

    // Carregar tabela
    function loadTable() {
        const persons = JSON.parse(localStorage.getItem('persons')) || [];
        const tbody = $('#personTable tbody');
        tbody.empty();

        persons.forEach((person, index) => {
            const row = `
                <tr>
                    <td>${person.name}</td>
                    <td>${person.email}</td>
                    <td>${person.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                    <td>${person.cpf_cnpj}</td>
                    <td>${person.cep}</td>
                    <td>${person.address}, ${person.number}, ${person.neighborhood}, ${person.city}, ${person.state}</td>
                    <td>
                        <button class="deleteButton" data-index="${index}">Excluir</button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }

    // Excluir pessoa
    $(document).on('click', '.deleteButton', function () {
        const index = $(this).data('index');
        const persons = JSON.parse(localStorage.getItem('persons')) || [];
        persons.splice(index, 1);
        localStorage.setItem('persons', JSON.stringify(persons));
        loadTable();
    });

    // Limpar formulário
    function clearForm() {
        $('#personForm')[0].reset();
        $('#cpfField, #cnpjField').hide();
    }

    // Inicializar tabela
    loadTable();
});

$('#cep').blur(function () {
    const cep = $(this).val().replace(/\D/g, '');

    // Validação básica de CEP
    if (cep.length === 8) {
        const url = `https://viacep.com.br/ws/${cep}/json/`;

        $.getJSON(url, function (data) {
            if (!data.erro) {
                $('#address').val(data.logradouro);
                $('#neighborhood').val(data.bairro);
                $('#city').val(data.localidade);
                $('#state').val(data.uf);
            } else {
                alert('CEP não encontrado.');
            }
        }).fail(function () {
            alert('Erro ao buscar o CEP. Tente novamente.');
        });
    } else {
        alert('CEP inválido. Digite um CEP válido.');
    }
});