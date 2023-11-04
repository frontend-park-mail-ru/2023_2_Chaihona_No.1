import { Api } from '@modules/api.js';
import navbar from '@components/Navbar/Navbar.js';
import register from '@components/Register/register.handlebars'
import {
  INCORRECT_LOGIN_ERROR_TEXT, MIN_FAIL_RESPONSE, MOUSE_CLICK_EVENT,
  NOT_FOUND_URL,
  PASS_REQUIREMENTS_TEXT, PASSWORDS_DONT_MATH_ERROR_TEXT,
  ROOT_ELEMENT_ID,
} from '@configs/common_config.js';

import css from "./register.css"

// 3-16 символов латинского алфавита/цифр/нижних подчёркиваний/тире
const loginRegExp = /^[A-z0-9_-]{5,16}$/;

// от 8 латинских символов, обязательно заглавные и строчные, цифры, спец символы
const passRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const LOGIN_FIELD_ID = '#login';
const PASSWORD_FIELD_ID = '#password';
const REPEAT_PASSWORD_FIELD_ID = '#repeat-password';
const SWITCH_AUTHOR_ID = '#toggle';

const REG_BUTTON_CLASS = '.regbutton';
const ERROR_FIELD_CLASS = '.error';

/**
 * Проверяет логин на соответствие требованиям
 * @param login - логин
 * @returns {boolean} - соответствует ли логин требованиям
 */
function verifyLogin(login) {
  // const re = new RegExp(loginRegExp);
  // return re.test(login);
  return true
}

/**
 *
 * Проверяет пароль на соответствие требованиям
 * @param password - пароль
 * @returns {boolean} - соответствует ли пароль требованиям
 */
function verifyPassword(password) {
  // const re = new RegExp(passRegExp);
  // return re.test(password);
  return true
}

/**
 * Отрисовка страницы регистрации
 */
export default async () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = '';
  rootElement.innerHTML = register();
  const err = document.querySelector(ERROR_FIELD_CLASS);
  err.textContent = PASS_REQUIREMENTS_TEXT;
  const regBtn = document.querySelector(REG_BUTTON_CLASS);
  /**
     * Добавление обработчика на кнопку регистрации. Проверяет правильность логина и пароля.
     * В случае ошибки выведет ошибку пользователю
     * В случае успеха перерисует навбар под пользователя и редиректнет на его страницу
     */
    regBtn.addEventListener(MOUSE_CLICK_EVENT, async (e) => {
      e.preventDefault();
      const api = new Api();
      const login = document.querySelector(LOGIN_FIELD_ID);
      const pass = document.querySelector(PASSWORD_FIELD_ID);
      const repeatPass = document.querySelector(REPEAT_PASSWORD_FIELD_ID);
      const isAuthor = document.querySelector(SWITCH_AUTHOR_ID).checked;
      if (pass.value !== repeatPass.value) {
        err.textContent = PASSWORDS_DONT_MATH_ERROR_TEXT;
        return;
      }
      if (!verifyLogin(login.value)) {
        err.textContent = INCORRECT_LOGIN_ERROR_TEXT;
        return;
      }
      if (!verifyPassword(pass.value)) {
        err.textContent = PASS_REQUIREMENTS_TEXT;
        return;
      }
      const result = await api.register(login.value, pass.value, isAuthor);
      if (result.status >= MIN_FAIL_RESPONSE) {
        window.router.redirect(NOT_FOUND_URL);
      }
      const user = { id: '1' };
      navbar(user);
    });
};
