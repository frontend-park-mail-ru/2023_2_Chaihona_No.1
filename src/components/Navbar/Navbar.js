import {MOUSE_CLICK_EVENT, NOT_FOUND_URL} from '@configs/common_config.js';
import ProfileMenu from "@components/ProfileMenu/ProfileMenu.js";
import navbarTmpl from '@components/Navbar/navbar.handlebars';

import css from './navbar.css';
import css2 from '@components/ProfileMenu/ProfileMenu.css'

import logoImage from '@static/img/logo.png';
import downArrowImage from '@static/icons/down-arrow.png';
import defaultAva from '@static/img/default-ava.png';

import {Api} from "@modules/api";

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
const Navbar = (user = null) => {
    const navbarElement = document.querySelector(NAVBAR_ELEMENT_ID);
    navbarElement.innerHTML = '';
    if (user) {
        navbarElement.innerHTML = navbarTmpl({User: user});
        const logo = document.querySelector(".navlogo");
        logo.src = logoImage;
        const logoutButton = document.querySelector('.exit-btn')
        logoutButton.addEventListener('click', async () => {
          const api = new Api();
          await api.logout();
          Navbar();
          window.router.redirect('login');
        })

        const userAvatar = document.querySelector(".nav-ava");
        userAvatar.src = defaultAva;

        const mainButton = document.getElementById('main-button');
        mainButton.addEventListener('click', ()=> {
            if (window.user !== undefined ){
                return window.router.redirect('feed');
            } else {
                return window.router.redirect('login');
            }
        })

        const subButton = document.querySelector(".button-down");
        subButton.src = downArrowImage;
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
};

export default Navbar;
