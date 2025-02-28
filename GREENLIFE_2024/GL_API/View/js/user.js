document.addEventListener('DOMContentLoaded', () => {
    // Função para buscar usuários cadastrados
    function fetchUsers() {
        fetch('https://localhost:7219/api/User') // URL da API para buscar usuários
            .then(response => response.json())
            .then(users => {
                const userTableBody = document.getElementById('userTableBody');
                userTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar novos dados

                // Itera sobre cada usuário e cria uma linha de tabela
                users.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.nome}</td>
                        <td>${user.email}</td>
                        <td>${user.senha}</td>
                    `;
                    userTableBody.appendChild(row); // Adiciona a linha à tabela
                });
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
            });
    }

    // Chama a função para buscar e exibir os usuários quando a página carregar
    fetchUsers();
});
