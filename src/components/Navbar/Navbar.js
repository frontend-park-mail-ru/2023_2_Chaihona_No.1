import { MOUSE_CLICK_EVENT, NOT_FOUND_URL } from '@configs/common_config.js';
import ProfileMenu from "@components/ProfileMenu/ProfileMenu.js";
import navbarTmpl from '@components/Navbar/navbar.handlebars';

import css from './navbar.css';
import css2 from '@components/ProfileMenu/ProfileMenu.css'

import logoImage from '@static/img/logo.png';

const NAVBAR_ELEMENT_ID = '#navbar';
const LOGIN_BUTTON_ID = '#login-btn';
const REGISTER_BUTTON_ID = '#reg-btn';

const MAIN_PAGE_BUTTON_CLASS = '.main-page-btn';
let menuOpen = false;

/**
 * Отрисовка навбара
 * @param user - пользователь. Если его нет, отрисует навбар с регистрацией,
 * иначе отрисует навбар с его данными.
 */
export default (user = null) => {
  const navbarElement = document.querySelector(NAVBAR_ELEMENT_ID);
  navbarElement.innerHTML = '';
  if (user) {
    navbarElement.innerHTML = navbarTmpl({ User: user});
    const logo = document.querySelector(".navlogo");
    logo.src = logoImage;
    const subButton = document.querySelector(".button-down");
    subButton.addEventListener('click', () => {
      const submenu = document.getElementById("submenu");
      if (menuOpen) {
        submenu.style.display = "none";
        subButton.style.rotate = "0deg"
        menuOpen = false;
      } else {
        submenu.style.display = "inline";
        subButton.style.rotate = "180deg"
        menuOpen = true;
        ProfileMenu();
      }
    });
  } else {
    navbarElement.innerHTML = navbarTmpl();
    const logo = document.querySelector(".navlogo");
    logo.src = logoImage;
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
