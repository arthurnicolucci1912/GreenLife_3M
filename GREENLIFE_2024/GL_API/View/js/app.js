document.addEventListener('DOMContentLoaded', () => {
    // AOS initialization
    AOS.init();
  
    // Abrir e fechar menu lateral
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');
    const closeIcon = document.querySelector('.close-icon');
  
    menuIcon.addEventListener('click', () => {
      sidebar.classList.add('active');
      closeIcon.style.display = 'block'; // Adicionei essa linha para mostrar o ícone de fechar
    });
  
    closeIcon.addEventListener('click', () => {
      sidebar.classList.remove('active');
      closeIcon.style.display = 'none'; // Adicionei essa linha para esconder o ícone de fechar
    });
  
    // Alternância da barra de pesquisa
    const searchIcon = document.querySelector('.search-icon');
    const searchBar = document.querySelector('.search-bar');
  
    searchIcon.addEventListener('click', () => {
      searchBar.classList.toggle('active');
    });
  
    // Botão sobre com efeito de rolagem
    const myButton = document.getElementById('myButton');
  
    myButton.addEventListener('click', () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    });
  });

  document.addEventListener('mousemove', (e) => {
    Object.assign(document.documentElement, {
        style: `
            --move-x: ${(e.clientX - window.innerWidth / 2) * -0.005}deg;
            --move-y: ${(e.clientY - window.innerHeight / 2) * -0.01}deg;
        `
    });
});