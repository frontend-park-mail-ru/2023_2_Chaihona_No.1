import { MOUSE_CLICK_EVENT, NOT_FOUND_URL } from '../../configs/common_config.js';

const NAVBAR_ELEMENT_ID = '#navbar';
const LOGIN_BUTTON_ID = '#login-btn';
const REGISTER_BUTTON_ID = '#reg-btn';

const MAIN_PAGE_BUTTON_CLASS = '.main-page-btn';

/**
 * Отрисовка навбара
 * @param user - пользователь. Если его нет, отрисует навбар с регистрацией,
 * иначе отрисует навбар с его данными.
 */
export default (user = null) => {
  const navbarElement = document.querySelector(NAVBAR_ELEMENT_ID);
  navbarElement.innerHTML = '';
  if (user) {
    navbarElement.innerHTML = Handlebars.templates.navbar({ User: { id: '1' } });
  } else {
    navbarElement.innerHTML = Handlebars.templates.navbar();
    const loginBtn = document.querySelector(LOGIN_BUTTON_ID);

    loginBtn.addEventListener(MOUSE_CLICK_EVENT, () => {
      window.router.redirect('/login');
    });
    const regBtn = document.querySelector(REGISTER_BUTTON_ID);
    regBtn.addEventListener(MOUSE_CLICK_EVENT, () => {
      window.router.redirect('/register');
    });
  }
  const mainBtn = document.querySelector(MAIN_PAGE_BUTTON_CLASS);
  mainBtn.addEventListener(MOUSE_CLICK_EVENT, () => {
    window.router.redirect(NOT_FOUND_URL);
  });
};
