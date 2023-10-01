import { Api } from '../../modules/api.js';
import navbar from '../Navbar/Navbar.js';

/**
 * Функция отрисовки страницы логина
 */
export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';
  rootElement.innerHTML = Handlebars.templates.login();

  const loginBtn = document.querySelector('.logbutton');

  // Добавляет обработчик на кнопку логина. В случае успеха перерисовывает навбар
  // под пользователя и редиректит на его страницу
  // В случае ошибки показывает ошибку в специальном поле
  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const login = document.querySelector('#login');
    const pass = document.querySelector('#password');
    const api = new Api();
    const result = await api.login(login.value, pass.value);
    if (result.status >= 400) {
      const err = document.querySelector('.error');
      err.textContent = 'Неправильный логин или пароль';
      return;
    }
    const user = { id: '1' };
    navbar(user);
    // window.router.goTo('/profile' + user.id);
  });
};
