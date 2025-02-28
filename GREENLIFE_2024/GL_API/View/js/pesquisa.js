async function searchPlantas(nome) {
    console.log(`Buscando plantas com o nome: ${nome}`);
    
    const response = await fetch(`https://localhost:7219/api/Plantas/search?nome=${encodeURIComponent(nome)}`);
    
    if (!response.ok) {
        throw new Error('Erro ao buscar plantas: ' + response.statusText);
    }

    return await response.json();
}

// Adiciona um evento de clique ao botão de pesquisa
document.getElementById('searchButton').addEventListener('click', async function() {
    const nome = document.getElementById('searchInput').value.trim();

    if (nome === "") {
        alert("Por favor, insira um nome para a pesquisa.");
        return;
    }

    try {
        const plantas = await searchPlantas(nome);

        const resultsContainer = document.getElementById('resultados');
        resultsContainer.innerHTML = ''; // Limpa resultados anteriores

        if (plantas.length === 0) {
            resultsContainer.innerHTML = '<p>Nenhuma planta encontrada.</p>';
        } else {
            plantas.forEach(planta => {
                const plantaDiv = document.createElement('div');
                plantaDiv.className = 'planta-item';

                const imagemHtml = planta.imagem ? `<img src="${planta.imagem}" alt="${planta.nome}">` : '';

                plantaDiv.innerHTML = `
                    <h3>${planta.nome}</h3>
                    <p><strong>Como Plantar:</strong> ${planta.comoPlantar || 'Não disponível'}</p>
                    <p><strong>Tipo:</strong> ${planta.tipo || 'Não disponível'}</p>
                    <p><strong>Semente:</strong> ${planta.semente || 'Não disponível'}</p>
                    <p><strong>Preciso:</strong> ${planta.preciso || 'Não disponível'}</p>
                    <p><strong>Recomendações:</strong> ${planta.recomendacoes || 'Não disponível'}</p>
                    ${imagemHtml}
                `;
                resultsContainer.appendChild(plantaDiv);
            });
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar dados. Tente novamente mais tarde.');
    }
});

// Adiciona a funcionalidade de pressionar Enter
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});
