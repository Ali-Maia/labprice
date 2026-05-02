document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm).entries());

      try {
        const response = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: data.email,
            password: data.password
          })
        });

        setSession(response.token, response.user);
        notify('Login realizado com sucesso');
        window.location.href = 'dashboard.html';
      } catch (error) {
        notify(error.message, 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(registerForm).entries());

      try {
        const response = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password
          })
        });

        notify(response.message || 'Cadastro concluído');
        window.location.href = 'login.html';
      } catch (error) {
        notify(error.message, 'error');
      }
    });
  }
});
