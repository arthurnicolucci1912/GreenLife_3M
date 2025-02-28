document.addEventListener('DOMContentLoaded', () => {
    const signInForm = document.querySelector('#sign-in-form');
    const signUpForm = document.querySelector('#sign-up-form');
    const signInBtn = document.querySelector("#sign-in-btn");
    const signUpBtn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");

    // Verifique se os botões existem
    if (!signInBtn || !signUpBtn) {
        console.error('Botões de alternância de formulário não encontrados');
        return;
    }

    // Alternar entre modos de formulário
    signUpBtn.addEventListener("click", () => {
        container.classList.add("sign-up-mode");
    });

    signInBtn.addEventListener("click", () => {
        container.classList.remove("sign-up-mode");
    });

    // Função para validar o email
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Lidar com o envio do formulário de login
    signInForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o comportamento padrão

        const email = document.querySelector('#sign-in-username').value; // Valor do campo de email
        const password = document.querySelector('#sign-in-password').value; // Valor do campo de senha

        if (!isValidEmail(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7219/Cadastro/Login', { // URL de login
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: email, Senha: password }), // Somente envia Email e Senha
            });

            if (response.ok) {
                const result = await response.json();
                if (result === 'Admin') {
                    window.location.href = 'PlantioAdmin.html'; // Redireciona para Admin
                } else {
                    window.location.href = 'Plantio.html'; // Redireciona para usuário
                }
            } else {
                const result = await response.json();
                console.error('Erro ao fazer login:', result);
                alert(result.message || 'Erro ao fazer login. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro de rede. Tente novamente mais tarde.');
        }
    });

    // Lidar com o envio do formulário de cadastro
    signUpForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o comportamento padrão

        const username = document.querySelector('#sign-up-username').value;
        const email = document.querySelector('#sign-up-email').value;
        const password = document.querySelector('#sign-up-password').value;

        if (!isValidEmail(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7219/Cadastro/Cadastro', { // URL de cadastro
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Nome: username, Email: email, Senha: password }), // Envia Nome, Email e Senha
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Cadastro bem-sucedido:', result);
                alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
                container.classList.remove("sign-up-mode"); // Volta para o formulário de login
            } else {
                const result = await response.text();
                console.error('Erro ao se cadastrar:', result);
                alert(result.message || 'Erro ao se cadastrar. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Erro de rede. Tente novamente mais tarde.');
        }
    });
});
