import { Api } from '../../modules/api.js';
import navbar from '../Navbar/Navbar.js';
import {
  MIN_FAIL_RESPONSE, LOGIN_ERROR_TEXT, ROOT_ELEMENT_ID, MOUSE_CLICK_EVENT,
} from '../../configs/common_config.js';

const LOGIN_BUTTON_CLASS = '.logbutton';
const ERROR_TEXT_CLASS = '.error';

const LOGIN_FIELD_ID = '#login';
const PASSWORD_FIELD_ID = '#password';

/**
 * Функция отрисовки страницы логина
 */
export default async () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = '';
  rootElement.innerHTML = Handlebars.templates.login();

  const loginBtn = document.querySelector(LOGIN_BUTTON_CLASS);

  // Добавляет обработчик на кнопку логина. В случае успеха перерисовывает навбар
  // под пользователя и редиректит на его страницу
  // В случае ошибки показывает ошибку в специальном поле
  loginBtn.addEventListener(MOUSE_CLICK_EVENT, async (e) => {
    e.preventDefault();
    const login = document.querySelector(LOGIN_FIELD_ID);
    const pass = document.querySelector(PASSWORD_FIELD_ID);
    const api = new Api();
    const result = await api.login(login.value, pass.value);
    if (result.status >= MIN_FAIL_RESPONSE) {
      const err = document.querySelector(ERROR_TEXT_CLASS);
      err.textContent = LOGIN_ERROR_TEXT;
      return;
    }
    const user = { id: '1' };
    navbar(user);
    // window.router.goTo('/profile' + user.id);
  });
};
