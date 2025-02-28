document.addEventListener('DOMContentLoaded', () => {
  const signInForm = document.querySelector('#sign-in-form');
  const signUpForm = document.querySelector('#sign-up-form');
  const signInBtn = document.querySelector("#sign-in-btn");
  const signUpBtn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");
  localStorage.clear();

  // Alternar entre os modos de formulário
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
    event.preventDefault();

    const email = document.querySelector('#sign-in-username').value; // ID corrigido
    const senha = document.querySelector('#sign-in-password').value;

    // Validar o email
    if (!isValidEmail(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      // Fazer a requisição para a API de login
      const response = await fetch('https://localhost:7219/Cadastro/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, Senha: senha }),
      });

      if (response.ok) {
        const result = await response.text();
        if (result === 'Admin') {
          window.location.href = 'PlantioAdmin.html'; // Redireciona para a página de Admin
        } else if (result === 'User') {
          localStorage.setItem("emailUser", email);
          window.location.href = 'Plantio.html'; // Redireciona para a página de Usuário
        } else {
          alert('Erro ao fazer login. Credenciais incorretas.');
        }
      } else {
        const errorText = await response.text();
        console.error('Erro ao fazer login:', errorText);
        alert('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Erro de rede. Tente novamente mais tarde.');
    }
  });

  // Lidar com o envio do formulário de cadastroS
  signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('#sign-up-username').value;
    const email = document.querySelector('#sign-up-email').value;
    const senha = document.querySelector('#sign-up-password').value;

    // Validar o email
    if (!isValidEmail(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    try {
      // Fazer a requisição para a API de cadastro
      const response = await fetch('https://localhost:7219/Cadastro/Cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Nome: username, Email: email, Senha: senha }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Cadastro bem-sucedido:', result);
        alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
        container.classList.remove("sign-up-mode"); // Alternar para o login
      } else {
        const errorText = await response.text();
        console.error('Erro ao se cadastrar:', errorText);
        alert('Erro ao se cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Erro de rede. Tente novamente mais tarde.');
    }
  });
});
