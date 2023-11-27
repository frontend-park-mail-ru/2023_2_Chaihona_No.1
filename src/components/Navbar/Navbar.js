import { MOUSE_CLICK_EVENT } from '@configs/common_config.js';
import ProfileMenu from '@components/ProfileMenu/ProfileMenu.js';
import navbarTmpl from '@components/Navbar/navbar.handlebars';

import logoImage from '@static/img/logo.png';
import downArrowImage from '@static/icons/down-arrow.png';

import { Api } from '@modules/api';
import css from './navbar.scss';
import profile from '../AuthorProfile/profile';
import { render } from 'nunjucks';

const NAVBAR_ELEMENT_ID = '#navbar';
const LOGIN_BUTTON_ID = '#login-btn';
const REGISTER_BUTTON_ID = '#reg-btn';

const LOGO_CLASS = '.navbar__logo';
const EXIT_BUTTON_CLASS = '.navbar__exit-button';
const AVATAR_CLASS = '.navbar__user-avatar';
const MENU_BUTTON_CLASS = '.navbar__down-button';
let menuOpen = false;
let searchOpen = false;

async function renderSearched(searched) {

  const searchedEl = document.querySelector('.searched__profiles');
  searchedEl.innerHTML = '';
  if (searched.profiles !== null && searched.profiles !== undefined){
    searched.profiles.forEach(async (profile) => {
      const profileEl = document.createElement('div');
      profileEl.classList.add('searched__profiles__profile');
    
      const avatar = new Image();
      const api = new Api();
      avatar.src = await api.getAvatar(profile.user.id);
      avatar.classList.add('searched__profiles__profile__avatar');
      profileEl.appendChild(avatar);
    
      profileEl.textContent = profile.user.login;
      searchedEl.appendChild(profileEl);
    });
  }
}

/**
 * Отрисовка навбара
 * @param user - пользователь. Если его нет, отрисует навбар с регистрацией,
 * иначе отрисует навбар с его данными.
 */
const Navbar = async (user = null) => {
  const navbarElement = document.querySelector(NAVBAR_ELEMENT_ID);
  navbarElement.innerHTML = '';
  if (user) {
    navbarElement.innerHTML = navbarTmpl({ User: user });
    const api = new Api();
    const logo = document.querySelector(LOGO_CLASS);
    logo.src = logoImage;
    const logoutButton = document.querySelector(EXIT_BUTTON_CLASS);
    logoutButton.addEventListener('click', async () => {
      await api.logout();
      Navbar();
      window.router.redirect('login');
    });

    const avatarElement = document.querySelector(AVATAR_CLASS);
    avatarElement.src = await api.getAvatar(user.id);

    const mainButton = document.getElementById('main-button');
    mainButton.addEventListener('click', () => {
      if (window.user !== undefined) {
        return window.router.redirect('feed');
      }
      return window.router.redirect('login');
    });

    const subButton = document.querySelector(MENU_BUTTON_CLASS);
    subButton.src = downArrowImage;
    const submenu = document.getElementById('submenu');
    subButton.addEventListener('click', () => {
      if (menuOpen) {
        submenu.style.display = 'none';
        subButton.style.rotate = '0deg';
        menuOpen = false;
      } else {
        submenu.style.display = 'inline';
        subButton.style.rotate = '180deg';
        menuOpen = true;
        ProfileMenu();
      }
    });
    const { children } = submenu;
    for (let i = 0; i < children.length; i++) {
      children[i].addEventListener('click', () => {
        submenu.style.display = 'none';
        subButton.style.rotate = '0deg';
        menuOpen = false;
      });
    }

    const searchEl = document.querySelector('.navbar__author-search');
    searchEl.addEventListener('input', async (e) => {
      if (!searchOpen) {
        searchEl.style.display = 'flex';
      }
      const searchRequest = await api.search(e.target.value);
      const searched = searchRequest.data.body;
      await renderSearched(searched);
    });
    searchEl.addEventListener('click', async (e) => {
      if (!searchOpen) {
        searchEl.style.display = 'flex';
      }
      const searchRequest = await api.search(e.target.value);
      const searched = searchRequest.data.body;
      await renderSearched(searched);
    });

    // const { root } = document.getElementById('root');
    // for (let i = 0; i < root.length; i++) {
    //   root[i].addEventListener('click', (e) => {
    //     searchEl.style.display = 'none';
    //     searchOpen = false;
    //   });
    // }
  } else {
    navbarElement.innerHTML = navbarTmpl();
    const logo = document.querySelector(LOGO_CLASS);
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
