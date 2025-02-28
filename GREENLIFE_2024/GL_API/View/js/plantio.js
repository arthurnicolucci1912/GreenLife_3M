// Função para adicionar um novo plantio
function addPlantio(event) {
    event.preventDefault();

    const nomePlantio = document.getElementById('addNomePlantio').value;
    const dataPlantio = document.getElementById('addData').value;
    const tipo = document.getElementById('addTipo').value;
    const semente = document.getElementById('addSemente').value;
    const local = document.getElementById('addLocal').value;
    const dataColheita = document.getElementById('addColheita').value;
    const emailUser = localStorage.getItem('emailUser'); // Obter email do localStorage

    if (!emailUser) {
        console.error('Email do usuário não encontrado no localStorage.');
        return; // Não prossegue se o email não estiver disponível
    }

    // Chamada para a API para adicionar o plantio
    fetch(`https://localhost:7219/api/Plantio?email=${encodeURIComponent(emailUser)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nomePlantio,
            dataPlantio,
            tipo,
            semente,
            local,
            dataColheita,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar plantio: ' + response.statusText);
        }
        return response.json(); // Modificar se você espera um JSON como resposta
    })
    .then(data => {
        console.log('Plantio adicionado:', data);
        // Opcional: redireciona ou atualiza a lista de plantios
        window.location.href = 'Plantio.html'; // Redireciona após adicionar
        document.getElementById('addPlantioForm').reset();
    })
    .catch(error => console.error('Erro ao adicionar plantio:', error));
}

// Função para buscar um plantio pelo ID
function fetchPlantioById(event) {
    event.preventDefault();

    const id = document.getElementById('updateId').value;
    const emailUser = localStorage.getItem('emailUser');

    if (!emailUser) {
        console.error('Email do usuário não encontrado no localStorage.');
        return;
    }

    fetch(`https://localhost:7219/api/Plantio/${id}?email=${encodeURIComponent(emailUser)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar plantio: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                document.getElementById('updateNomePlantio').value = data.nomePlantio;
                document.getElementById('updatePlantio').value = data.dataPlantio;
                document.getElementById('updateTipo').value = data.tipo;
                document.getElementById('updateSemente').value = data.semente;
                document.getElementById('updateLocal').value = data.local;
                document.getElementById('updateColheita').value = data.dataColheita;
            } else {
                console.log('Plantio não encontrado.');
            }
        })
        .catch(error => console.error('Erro ao buscar plantio:', error));
}

// Função para atualizar um plantio
function updatePlantio(event) {
    event.preventDefault();

    const id = document.getElementById('updateId').value;
    const nomePlantio = document.getElementById('updateNomePlantio').value;
    const dataPlantio = document.getElementById('updatePlantio').value;
    const tipo = document.getElementById('updateTipo').value;
    const semente = document.getElementById('updateSemente').value;
    const local = document.getElementById('updateLocal').value;
    const dataColheita = document.getElementById('updateColheita').value;

    // Obtém o email do usuário do localStorage
    const emailUser = localStorage.getItem('emailUser'); // Certifique-se de que o email está salvo no localStorage

    if (!emailUser) {
        console.error('Email do usuário não encontrado no localStorage.');
        return;
    }

    // Chamada para a API para atualizar o plantio
    fetch(`https://localhost:7219/api/Plantio/${id}?email=${encodeURIComponent(emailUser)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nomePlantio,
            dataPlantio,
            tipo,
            semente,
            local,
            dataColheita,
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => {
        console.log('Plantio atualizado:', data);
        document.getElementById('updatePlantioForm').reset();
    })
    .catch(error => console.error('Erro ao atualizar plantio:', error));
}

function deletePlantio(event) {
    event.preventDefault();

    const id = document.getElementById('deleteId').value;
    // Obtém o email do usuário do localStorage
    const emailUser = localStorage.getItem('emailUser'); // Certifique-se de que o email está salvo no localStorage

    if (!emailUser) {
        console.error('Email do usuário não encontrado no localStorage.');
        return;
    }

    // Chamada para a API para excluir o plantio
    fetch(`https://localhost:7219/api/Plantio/${id}?email=${encodeURIComponent(emailUser)}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Plantio excluído com sucesso');
            document.getElementById('deletePlantioForm').reset();
        } else if (response.status === 403) {
            console.error('Você não tem permissão para excluir este plantio.');
        } else {
            return response.json().then(err => {
                throw new Error(err.message);
            });
        }
    })
    .catch(error => console.error('Erro ao excluir plantio:', error));
}


// Função para calcular os dias até a colheita
function calculateDaysUntilColheita(dataPlantio, dataColheita) {
    const plantio = new Date(dataPlantio);
    const colheita = new Date(dataColheita);

    plantio.setHours(0, 0, 0, 0);
    colheita.setHours(0, 0, 0, 0);

    if (isNaN(colheita.getTime()) || isNaN(plantio.getTime())) {
        console.error('Data de plantio ou colheita inválida:', dataPlantio, dataColheita);
        return 0; 
    }
    
    if (colheita < plantio) {
        console.warn('A data de colheita é anterior à data de plantio.');
        return 0; 
    }

    const daysUntilColheita = Math.ceil((colheita - plantio) / (1000 * 60 * 60 * 24)); 
    return daysUntilColheita; 
}

// Função para calcular a porcentagem de progresso
function calculateProgressPercentage(dataPlantio, dataColheita) {
    const plantio = new Date(dataPlantio);
    const colheita = new Date(dataColheita);
    
    plantio.setHours(0, 0, 0, 0);
    colheita.setHours(0, 0, 0, 0);

    const totalDays = Math.ceil((colheita - plantio) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((new Date() - plantio) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
        return 0; // Se a data da colheita for anterior ou igual à do plantio
    }

    const percentage = Math.min(100, (daysPassed / totalDays) * 100);
    return percentage.toFixed(0); // Arredondando para um inteiro
}

// Função para atualizar a exibição da colheita
function updateColheitaDisplay(daysUntilColheita) {
    const colheitaDaysElem = document.getElementById('colheitaDays');
    const percentColheitaElem = document.getElementById('percentColheita');
    
    colheitaDaysElem.textContent = `${daysUntilColheita} dias`;

    let percent = Math.max(0, Math.min(100, 100 - (daysUntilColheita / 365 * 100)));
    percentColheitaElem.textContent = `${percent.toFixed(0)}%`;
}
// Função para contar o total de plantios
function updateTotalPlantios(plantios) {
    const totalPlantiosElem = document.getElementById('totalPlantios');
    if (totalPlantiosElem) {
        totalPlantiosElem.textContent = plantios.length; // Atualiza com o total de plantios
    }
}
// Função para buscar e exibir plantios
function fetchAndDisplayPlantios() {
    // Obtém o email do usuário do localStorage
    const emailUser = localStorage.getItem('emailUser');

    if (!emailUser) {
        console.error('Email do usuário não encontrado no localStorage.');
        return;
    }

    // Faz a requisição passando o email como parâmetro
    fetch(`https://localhost:7219/api/Plantio?email=${encodeURIComponent(emailUser)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar plantios: ' + response.statusText);
        }
        return response.json();
    })
    .then(plantios => {
        const plantioTableBody = document.getElementById('plantioTableBody');
        if (!plantioTableBody) {
            console.error('Elemento plantioTableBody não encontrado no DOM.');
            return;
        }
        plantioTableBody.innerHTML = '';

        plantios.forEach(plantio => {
            const dataFormatada = new Date(plantio.dataPlantio).toLocaleDateString('pt-BR');
            const daysUntilColheita = calculateDaysUntilColheita(plantio.dataPlantio, plantio.dataColheita);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plantio.nomePlantio || 'N/A'}</td>
                <td>${plantio.id || 'N/A'}</td>
                <td>${dataFormatada || 'N/A'}</td>
                <td>${plantio.tipo || 'N/A'}</td>
                <td>${plantio.semente || 'N/A'}</td>
                <td>${plantio.local || 'N/A'}</td>
                <td>${new Date(plantio.dataColheita).toLocaleDateString('pt-BR') || 'N/A'}</td>
                <td>${daysUntilColheita} dias</td> <!-- Exibindo dias até a colheita -->
            `;
            row.addEventListener('click', () => {
                // Atualiza a exibição de dias e porcentagem ao clicar
                updateColheitaDisplay(daysUntilColheita, plantio.dataPlantio, plantio.dataColheita);
            });
        
            plantioTableBody.appendChild(row);
        });

        // Atualiza o total de plantios
        updateTotalPlantios(plantios);
    })
    .catch(error => console.error('Erro ao buscar plantios:', error));
}


// Função para atualizar a exibição do modal com dados do plantio
function showPlantioDetails(plantio) {
    document.getElementById('modalNomePlantio').textContent = `Nome do Plantio: ${plantio.nomePlantio}`;
    document.getElementById('modalDataPlantio').textContent = `Data do Plantio: ${new Date(plantio.dataPlantio).toLocaleDateString('pt-BR')}`;
    document.getElementById('modalTipo').textContent = `Tipo: ${plantio.tipo}`;
    document.getElementById('modalSemente').textContent = `Semente: ${plantio.semente}`;
    document.getElementById('modalLocal').textContent = `Local: ${plantio.local}`;
    document.getElementById('modalDataColheita').textContent = `Data de Colheita: ${new Date(plantio.dataColheita).toLocaleDateString('pt-BR')}`;
    document.getElementById('modalDiasColheita').textContent = `Dias até a Colheita: ${calculateDaysUntilColheita(plantio.dataPlantio, plantio.dataColheita)} dias`;

    const modal = document.getElementById('plantioModal');
    modal.style.display = "block";

    // Adiciona o evento para fechar o modal
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Fecha o modal ao clicar fora dele
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const addPlantioForm = document.getElementById('addPlantioForm');
    if (addPlantioForm) {
        addPlantioForm.addEventListener('submit', addPlantio);

    }

    fetchAndDisplayPlantios();
});
document.addEventListener('DOMContentLoaded', function() {
    const updatePlantioForm = document.getElementById('updatePlantioForm');
    if (updatePlantioForm) {
        updatePlantioForm.addEventListener('submit', updatePlantio);
    }

    fetchAndDisplayPlantios();
});
document.addEventListener('DOMContentLoaded', function() {
    const deletePlantioForm = document.getElementById('deletePlantioForm');
    if (deletePlantioForm) {
        deletePlantioForm.addEventListener('submit', deletePlantio);
    }

    fetchAndDisplayPlantios();
});
