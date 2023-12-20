import { Api } from '@modules/api.js';
import navbar from '@components/Navbar/Navbar.js';
import loginTemplate from '@components/Login/login.handlebars';
import {
  MIN_FAIL_RESPONSE, LOGIN_ERROR_TEXT, ROOT_ELEMENT_ID, MOUSE_CLICK_EVENT,
} from '@configs/common_config.js';

import pigImg from '@static/img/pngwing1.png';
import css from './login.scss';

const LOGIN_BUTTON_CLASS = '.login-page__input-login-button';
const ERROR_TEXT_CLASS = '.login-page__error-text';
const PIG_IMAGE_CLASS = '.login-page__pig-img';
const hidePassId = 'hide-pass';
const PASSWORD_HIDE_ID = 'register-page__pass-icon_hide';

const LOGIN_FIELD_ID = '#login';
const PASSWORD_FIELD_ID = '#password';

/**
 * Функция отрисовки страницы логина
 */
export default async () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = '';
  rootElement.innerHTML = loginTemplate();
  
  const hidePassEl = document.getElementById(hidePassId);
  const loginBtn = document.querySelector(LOGIN_BUTTON_CLASS);
  const pig = document.querySelector(PIG_IMAGE_CLASS);
  pig.src = pigImg;

  const pass = document.getElementById("password");
  hidePassEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (pass.getAttribute('type') === 'password') {
      hidePassEl.classList.add(PASSWORD_HIDE_ID);
      pass.setAttribute('type', 'text');
    } else {
      hidePassEl.classList.remove(PASSWORD_HIDE_ID);
      pass.setAttribute('type', 'password');
    }
  });

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
      if (result.status === 521) {
        err.textContent = 'Ошибка: нет подключения к Интернету!';
        return;
      }
      err.textContent = LOGIN_ERROR_TEXT;
      return;
    }
    const user = { id: result.data.body.id };
    window.user = user;
    await navbar(user);
    subscribe();
    window.router.redirect(`/profile${user.id}`);
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