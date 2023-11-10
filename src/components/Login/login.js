import { Api } from '@modules/api.js';
import navbar from '@components/Navbar/Navbar.js';
import login from '@components/Login/login.handlebars'
import {
  MIN_FAIL_RESPONSE, LOGIN_ERROR_TEXT, ROOT_ELEMENT_ID, MOUSE_CLICK_EVENT,
} from '@configs/common_config.js';

import css from "./login.scss"

const LOGIN_BUTTON_CLASS = '.login-page__input-login-button';
const ERROR_TEXT_CLASS = '.login-page__error-text';
const PIG_IMAGE_CLASS = '.login-page__pig-img'


const LOGIN_FIELD_ID = '#login';
const PASSWORD_FIELD_ID = '#password';

import pigImg from '@static/img/pngwing1.png'

/**
 * Функция отрисовки страницы логина
 */
export default async () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = '';
  rootElement.innerHTML = login();

  const loginBtn = document.querySelector(LOGIN_BUTTON_CLASS);
  const pig = document.querySelector(PIG_IMAGE_CLASS);
  pig.src = pigImg;

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
    const user = { id: result.data.body.id };
    window.user = user;
    navbar(user);
    window.router.redirect('/profile' + user.id);
  });
};
