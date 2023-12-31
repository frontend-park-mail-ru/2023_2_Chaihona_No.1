import { Api } from '@modules/api.js';
import navbar from '@components/Navbar/Navbar.js';
import register from '@components/Register/register.handlebars';
import {
  INCORRECT_LOGIN_ERROR_TEXT, MIN_FAIL_RESPONSE, MOUSE_CLICK_EVENT,
  PASS_REQUIREMENTS_TEXT, PASSWORDS_DONT_MATH_ERROR_TEXT,
  ROOT_ELEMENT_ID,
} from '@configs/common_config.js';

import pigImg from '@static/img/pngwing1.png';
import css from './register.scss';

// 3-16 символов латинского алфавита/цифр/нижних подчёркиваний/тире
const loginRegExp = /^[A-z0-9_-]{5,16}$/;

// от 8 латинских символов, обязательно заглавные и строчные, цифры, спец символы
const passRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const INPUT_EVENT = 'input';
const CUT_EVENT = 'cut';
const PASTE_EVENT = 'paste';

const LOGIN_FIELD_ID = '#login';
const PASSWORD_FIELD_ID = 'password';
const REPEAT_PASSWORD_FIELD_ID = 'repeat-password';
const SWITCH_AUTHOR_ID = '#toggle';
const STR_ID = 'str';
const ZAG_ID = 'zag';
const NUMS_ID = 'nums';
const SPECS_ID = 'specs';
const OTHER_ID = 'other';
const EIGHT_ID = 'eight';

const REG_BUTTON_CLASS = '.register-page__input-register-button';
const ERROR_FIELD_CLASS = '.register-page__error-text';
const PIG_IMAGE_CLASS = '.register-page__pig-img';

const ALREADY_EXISTS_ERR_TEXT = 'Пользователь с таким логином уже существует';

const PASSWORD_HIDE_ID = 'register-page__pass-icon_hide';
const PASS_NE_ID = 'pass-ne';

const REQ_NEGATIVE_CLASS = 'register-page__input-password-reqs_negative';
const REQ_POSITIVE_CLASS = 'register-page__input-password-reqs_positive';

const letterType = 'LETTER';
const bigLetterType = 'BIGLETTER';
const numberType = 'NUMBER';
const symbolType = 'SYMBOL';
const notAllowedType = 'NOTALLOWED';

const hidePassId = 'hide-pass';
const hideRepPassId = 'hide-rep-pass';

const ATTRIBUTE_TEXt = 'text';
const ATTRIBUTE_TYPE = 'type';
const ATTRIBUTE_PASWORD = 'password';

const STYLE_DISPLAY_BLOCK = 'block';
const STYLE_DISPLAY_NONE = 'none';

const TEXT_PLAIN_TYPE = 'text/plain';

let nums = 0;
let letters = 0;
let bigLetters = 0;
let symbols = 0;
let notAllowed = 0;
let prevPass = '';

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

function getChangedCharacters(prevStr, newStr, deleted) {
  let len;
  let result = '';
  if (deleted) {
    len = prevStr.length;
  } else {
    len = newStr.length;
  }
  for (let i = len - 1; i >= 0; i--) {
    if (prevStr[i] !== newStr[i]) {
      if (deleted) {
        result += prevStr[i];
      } else {
        result += newStr[i];
      }
    }
  }
  return result;
}

function typeOf(changed) {
  if (changed.match(/[a-z]/)) {
    return letterType;
  } if (changed.match(/[A-Z]/)) {
    return bigLetterType;
  } if (changed.match(/[0-9]/)) {
    return numberType;
  } if (changed.match(/[#?!@$%^&*-]/)) {
    return symbolType;
  }
  return notAllowedType;
}

function redrawRequirement(element, count, toAdd, reverse = false) {
  let rightEl = REQ_POSITIVE_CLASS;
  let wrongEl = REQ_NEGATIVE_CLASS;
  if (reverse) {
    rightEl = REQ_NEGATIVE_CLASS;
    wrongEl = REQ_POSITIVE_CLASS;
  }
  if (count === 0) {
    element.classList.add(rightEl);
    element.classList.remove(wrongEl);
  }
  count += toAdd;
  if (count === 0) {
    element.classList.add(wrongEl);
    element.classList.remove(rightEl);
  }
  return count;
}

function proceedChanges(value, changed, count) {
  for (let i = 0; i < changed.length; i++) {
    switch (typeOf(changed[i])) {
      case letterType:
        const letterReq = document.getElementById(STR_ID);
        letters = redrawRequirement(letterReq, letters, count);
        break;
      case bigLetterType:
        const bigLetterReq = document.getElementById(ZAG_ID);
        bigLetters = redrawRequirement(bigLetterReq, bigLetters, count);
        break;
      case numberType:
        const numberReq = document.getElementById(NUMS_ID);
        nums = redrawRequirement(numberReq, nums, count);
        break;
      case symbolType:
        const symbolReq = document.getElementById(SPECS_ID);
        symbols = redrawRequirement(symbolReq, symbols, count);
        break;
      case notAllowedType:
        const notAllowedReq = document.getElementById(OTHER_ID);
        notAllowed = redrawRequirement(notAllowedReq, notAllowed, count, true);
    }
  }
  const lenReq = document.getElementById(EIGHT_ID);
  if (value.length < 8) {
    lenReq.classList.add(REQ_NEGATIVE_CLASS);
  } else {
    lenReq.classList.remove(REQ_NEGATIVE_CLASS);
    lenReq.classList.add(REQ_POSITIVE_CLASS);
  }
  prevPass = value;
}

/**
 * Отрисовка страницы регистрации
 */
export default async () => {
  nums = 0;
  letters = 0;
  bigLetters = 0;
  symbols = 0;
  notAllowed = 0;
  prevPass = '';
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = '';
  rootElement.innerHTML = register();
  const hidePassEl = document.getElementById(hidePassId);
  const hideRepPassEl = document.getElementById(hideRepPassId);
  const pass = document.getElementById(PASSWORD_FIELD_ID);
  const repeatPass = document.getElementById(REPEAT_PASSWORD_FIELD_ID);
  const err = document.querySelector(ERROR_FIELD_CLASS);
  const pig = document.querySelector(PIG_IMAGE_CLASS);
  pig.src = pigImg;
  // err.textContent = PASS_REQUIREMENTS_TEXT;
  const regBtn = document.querySelector(REG_BUTTON_CLASS);
  const login = document.querySelector(LOGIN_FIELD_ID);
  const isAuthor = document.querySelector(SWITCH_AUTHOR_ID);

  [pass, repeatPass, login].forEach((formEl) => {
    formEl.addEventListener(INPUT_EVENT, () => {
      const newData = {
        register: {
          login: login.value, password: pass.value, repeatPassword: repeatPass.value, isAuthor: isAuthor.checked,
        },
      };
      window.history.replaceState(newData, null, window.location.pathname);
    });
  });

  isAuthor.addEventListener(MOUSE_CLICK_EVENT, () => {
    const newData = {
      register: {
        login: login.value, password: pass.value, repeatPassword: repeatPass.value, isAuthor: isAuthor.checked,
      },
    };
    window.history.replaceState(newData, null, window.location.pathname);
  });

  [hidePassEl, hideRepPassEl].forEach((hideEl) => {
    hideEl.addEventListener(MOUSE_CLICK_EVENT, (e) => {
      e.preventDefault();
      if (pass.getAttribute(ATTRIBUTE_TYPE) === ATTRIBUTE_PASWORD) {
        hidePassEl.classList.add(PASSWORD_HIDE_ID);
        hideRepPassEl.classList.add(PASSWORD_HIDE_ID);
        pass.setAttribute(ATTRIBUTE_TYPE, ATTRIBUTE_TEXt);
        repeatPass.setAttribute(ATTRIBUTE_TYPE, ATTRIBUTE_TEXt);
      } else {
        hidePassEl.classList.remove(PASSWORD_HIDE_ID);
        hideRepPassEl.classList.remove(PASSWORD_HIDE_ID);
        pass.setAttribute(ATTRIBUTE_TYPE, ATTRIBUTE_PASWORD);
        repeatPass.setAttribute(ATTRIBUTE_TYPE, ATTRIBUTE_PASWORD);
      }
    });
  });

  pass.addEventListener(INPUT_EVENT, () => {
    const { value } = pass;
    let changed;
    let count = 1;
    if (value.length > prevPass.length) {
      changed = getChangedCharacters(prevPass, value, false);
    } else {
      changed = getChangedCharacters(prevPass, value, true);
      count = -1;
    }
    proceedChanges(value, changed, count);
    const dontMatchEl = document.getElementById(PASS_NE_ID);
    if (repeatPass.value !== pass.value) {
      dontMatchEl.style.display = STYLE_DISPLAY_BLOCK;
    } else {
      dontMatchEl.style.display = STYLE_DISPLAY_NONE;
    }
  });

  pass.addEventListener(CUT_EVENT, () => {
    const { value } = pass;
    const changed = document.getSelection();
    const count = -1;
    proceedChanges(value, changed, count);
  });

  pass.addEventListener(PASTE_EVENT, (event) => {
    const { value } = pass;
    const changed = event.clipboardData.getData(TEXT_PLAIN_TYPE);
    const count = 1;
    proceedChanges(value, changed, count);
  });

  repeatPass.addEventListener(INPUT_EVENT, () => {
    const dontMatchEl = document.getElementById(PASS_NE_ID);
    if (repeatPass.value !== pass.value) {
      dontMatchEl.style.display = STYLE_DISPLAY_BLOCK;
    } else {
      dontMatchEl.style.display = STYLE_DISPLAY_NONE;
    }
  });

  if (window.history.state !== null && window.history.state.register !== undefined) {
    const lastFilledForm = window.history.state.register;
    login.value = lastFilledForm.login;
    pass.value = lastFilledForm.password;
    repeatPass.value = lastFilledForm.repeatPassword;
    isAuthor.checked = lastFilledForm.isAuthor;
    proceedChanges(lastFilledForm.password, lastFilledForm.password, 1);
  }

  /**
     * Добавление обработчика на кнопку регистрации. Проверяет правильность логина и пароля.
     * В случае ошибки выведет ошибку пользователю
     * В случае успеха перерисует навбар под пользователя и редиректнет на его страницу
     */
  regBtn.addEventListener(MOUSE_CLICK_EVENT, async (e) => {
    e.preventDefault();
    const api = new Api();
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
    const result = await api.register(login.value, pass.value, isAuthor.checked);
    if (result.status >= MIN_FAIL_RESPONSE) {
      if (result.status === 521) {
        err.textContent = 'Ошибка: нет подключения к Интернету!';
        return;
      }
      err.textContent = ALREADY_EXISTS_ERR_TEXT;
      return;
    }
    const user = { id: result.data.body.id };
    window.user = user;
    subscribe();
    window.router.redirect(`/profile${result.data.body.id}`);
    await navbar(user);
  });
};

function subscribe() {
  // запрашиваем разрешение на получение уведомлений
  window.messaging.requestPermission()
      .then(function () {
          // получаем ID устройства
          window.messaging.getToken()
              .then(async function (currentToken) {
                  console.log(currentToken);
                  const api = new Api();
                  await api.addDevice(currentToken);
                  if (currentToken) {
                      sendTokenToServer(currentToken);
                  } else {
                      console.warn('Не удалось получить токен.');
                      setTokenSentToServer(false);
                  }
              })
              .catch(function (err) {
                  console.warn('При получении токена произошла ошибка.', err);
                  setTokenSentToServer(false);
              });
  })
  .catch(function (err) {
      console.warn('Не удалось получить разрешение на показ уведомлений.', err);
  });
}

// отправка ID на сервер
async function sendTokenToServer(currentToken) {

  if (!isTokenSentToServer(currentToken)) {
      console.log('Отправка токена на сервер...');

      // var url = ''; // адрес скрипта на сервере который сохраняет ID устройства
      // $.post(url, {
      //     token: currentToken
      // });

      setTokenSentToServer(currentToken);
  } else {
      console.log('Токен уже отправлен на сервер.');
  }
}

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления
function isTokenSentToServer(currentToken) {
  return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
  window.localStorage.setItem(
      'sentFirebaseMessagingToken',
      currentToken ? currentToken : ''
  );
}