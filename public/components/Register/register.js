import { Api } from '../../modules/api.js';
import navbar from '../Navbar/Navbar.js';

// 3-16 символов латинского алфавита/цифр/нижних подчёркиваний/тире
const loginRegExp = /^[A-z0-9_-]{5,16}$/;

// от 8 латинских символов, обязательно заглавные и строчные, цифры, спец символы
const passRegExp = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;

/**
 * Проверяет логин на соответствие требованиям
 * @param login - логин
 * @returns {boolean} - соответствует ли логин требованиям
 */
function verifyLogin(login) {
  const re = new RegExp(loginRegExp);
  return re.test(login);
}

/**
 *
 * Проверяет пароль на соответствие требованиям
 * @param password - пароль
 * @returns {boolean} - соответствует ли пароль требованиям
 */
function verifyPassword(password) {
  const re = new RegExp(passRegExp);
  return re.test(password);
}

/**
 * Отрисовка страницы регистрации
 */
export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';
  rootElement.innerHTML = Handlebars.templates.register();
  const err = document.querySelector('.error');
  err.textContent = 'Пароль должен быть длиннее 8 символов и содержать буквы разных регистров, цифры и специальные символы.';
  const regBtn = document.querySelector('.regbutton');

  /**
     * Добавление обработчика на кнопку регистрации. Проверяет правильность логина и пароля.
     * В случае ошибки выведет ошибку пользователю
     * В случае успеха перерисует навбар под пользователя и редиректнет на его страницу
     */
  regBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const api = new Api();
    const login = document.querySelector('#login');
    const pass = document.querySelector('#password');
    const repeatPass = document.querySelector('#repeat-password');
    const isAuthor = document.querySelector('#toggle').checked;
    if (pass.value !== repeatPass.value) {
      err.textContent = 'Пароли не совпадают';
      return;
    }
    if (!verifyLogin(login.value)) {
      err.textContent = 'Логин должен быть от 3 до 16 символов и может содержать только цифры, латинские буквы и - _.';
      return;
    }
    if (!verifyPassword(pass.value)) {
      err.textContent = 'Пароль должен быть длиннее 8 символов и содержать буквы разных регистров, цифры и специальные символы.';
      return;
    }
    const result = await api.register(login.value, pass.value, isAuthor);
    if (result.status >= 400) {
      window.router.redirect('nenahod');
    }
    const user = { id: '1' };
    navbar(user);
  });
};
