import {
  MOUSE_CLICK_EVENT,
  LOGIN_URL,
  FEED_URL,
  REGISTER_URL,
} from '@configs/common_config.js';
import ProfileMenu from '@components/ProfileMenu/ProfileMenu.js';
import navbarTmpl from '@components/Navbar/navbar.handlebars';

import logoImage from '@static/img/logo.png';
import downArrowImage from '@static/icons/down-arrow.png';

import { Api } from '@modules/api';
import css from './navbar.scss';
import profile from '../AuthorProfile/profile';
// import { render } from 'nunjucks';
// import { root } from 'postcss';

const INPUT_EVENT = 'input';

const NAVBAR_ELEMENT_ID = '#navbar';
const LOGIN_BUTTON_ID = '#login-btn';
const REGISTER_BUTTON_ID = '#reg-btn';
const MAIN_BUTTON_ID = 'main-button';
const SUBMENU_ID = 'submenu';
const ROOT_ID = 'root';

const LOGO_CLASS = '.navbar__logo';
const EXIT_BUTTON_CLASS = '.navbar__exit-button';
const AVATAR_CLASS = '.navbar__user-avatar';
const MENU_BUTTON_CLASS = '.navbar__down-button';
const SEARCHED_PROFILES = '.searched__profiles';
const SEARCHED_PROFILES_PROFILE_CLASS = 'searched__profiles__profile';
const SEARCHED_PROFILES_PROFILE__AVATAR_CLASS = 'searched__profiles__profile__avatar';
const AVA_FIGURE_CLASS = 'ava-figure';
const SEARCHED_CLASS = '.searched';
const NAVBAR_AUTHOR_SEARCH_CLASS = '.navbar__author-search';

const TAG_DIV = 'div';
const TAG_FIGURE = 'figure';

const STYLE_NONE = 'none';
const STYLE_FLEX = 'flex';
const STYLE_ROTATE_0DEG = '0deg';
const STYLE_ROTATE_180DEG = '180deg';


let menuOpen = false;
let searchOpen = false;

function renderSearched(searched) {
  const searchedEl = document.querySelector(SEARCHED_PROFILES);
  searchedEl.innerHTML = '';
  if (searched.profiles !== null && searched.profiles !== undefined){
    searched.profiles.forEach(async (profile) => {
      const profileEl = document.createElement(TAG_DIV);
      profileEl.classList.add(SEARCHED_PROFILES_PROFILE_CLASS);
      const avatar = new Image();
      // const api = new Api();
      // avatar.src = await api.getAvatar(profile.user.id);
      avatar.src = profile.avatar;
      avatar.classList.add(SEARCHED_PROFILES_PROFILE__AVATAR_CLASS);
      profileEl.textContent = profile.user.login;

      const figure = document.createElement(TAG_FIGURE);
      figure.classList.add(AVA_FIGURE_CLASS);
      figure.appendChild(avatar);
      profileEl.appendChild(figure);
      profileEl.addEventListener(MOUSE_CLICK_EVENT, (e) => {
        window.router.redirect(`profile${profile.user.id}`);
        return;
      });
    
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
    logoutButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
      await api.logout();
      Navbar();
      window.router.redirect(LOGIN_URL);
    });

    const avatarElement = document.querySelector(AVATAR_CLASS);
    avatarElement.src = await api.getAvatar(user.id);

    const mainButton = document.getElementById(MAIN_BUTTON_ID);
    mainButton.addEventListener(MOUSE_CLICK_EVENT, () => {
      if (window.user !== undefined) {
        return window.router.redirect(FEED_URL);
      }
      return window.router.redirect(LOGIN_URL);
    });
    logo.addEventListener(MOUSE_CLICK_EVENT, () => {
      if (window.user !== undefined) {
        return window.router.redirect(FEED_URL);
      }
      return window.router.redirect(LOGIN_URL);
    });

    const subButton = document.querySelector(MENU_BUTTON_CLASS);
    subButton.src = downArrowImage;
    const submenu = document.getElementById(SUBMENU_ID);
    subButton.addEventListener(MOUSE_CLICK_EVENT, () => {
      if (menuOpen) {
        submenu.style.display = STYLE_NONE;
        subButton.style.rotate = STYLE_ROTATE_0DEG;
        menuOpen = false;
      } else {
        submenu.style.display = STYLE_FLEX;
        subButton.style.rotate = STYLE_ROTATE_180DEG;
        menuOpen = true;
        ProfileMenu();
      }
    });
    const { children } = submenu;
    for (let i = 0; i < children.length; i++) {
      children[i].addEventListener(MOUSE_CLICK_EVENT, () => {
        submenu.style.display = STYLE_NONE;
        subButton.style.rotate = STYLE_ROTATE_0DEG;
        menuOpen = false;
      });
    }
    const searchedEl = document.querySelector(SEARCHED_CLASS);
    const searchEl = document.querySelector(NAVBAR_AUTHOR_SEARCH_CLASS);
    searchEl.addEventListener(INPUT_EVENT, async (e) => {
      if (!searchOpen) {
        searchedEl.style.display = STYLE_FLEX;
      }
      const searchRequest = await api.search(e.target.value);
      const searched = searchRequest.data.body;
      if (searched.profiles !== undefined && searched.profiles !== null) {
        for (let i = 0; i < searched.profiles.length; ++i) {
          searched.profiles[i].avatar = await api.getAvatar(searched.profiles[i].user.id);
        }
      }
      renderSearched(searched);
    });
    searchEl.addEventListener(MOUSE_CLICK_EVENT, async (e) => {
      if (!searchOpen) {
        searchedEl.style.display = STYLE_FLEX;
      }
      const searchRequest = await api.search(e.target.value);
      const searched = searchRequest.data.body;
      if (searched.profiles !== undefined && searched.profiles !== null) {
        for (let i = 0; i < searched.profiles.length; ++i) {
          searched.profiles[i].avatar = await api.getAvatar(searched.profiles[i].user.id);
        }
      }
      renderSearched(searched);
    });

    const rootEl = document.getElementById(ROOT_ID);
    rootEl.addEventListener(MOUSE_CLICK_EVENT, (e) => {
        if (searchedEl !== undefined && searchedEl !== null) {
          searchedEl.style.display = STYLE_NONE;
          searchOpen = false;
        }

        if (submenu !== undefined && submenu !== null){
          submenu.style.display = STYLE_NONE;
          subButton.style.rotate = STYLE_ROTATE_0DEG;
          menuOpen = false;
        }
    });
  } else {
    navbarElement.innerHTML = navbarTmpl();
    const logo = document.querySelector(LOGO_CLASS);
    logo.src = logoImage;
    const loginBtn = document.querySelector(LOGIN_BUTTON_ID);

    loginBtn.addEventListener(MOUSE_CLICK_EVENT, () => {
      window.router.redirect('/' + LOGIN_URL);
    });
    const regBtn = document.querySelector(REGISTER_BUTTON_ID);
    regBtn.addEventListener(MOUSE_CLICK_EVENT, () => {
      window.router.redirect('/' + REGISTER_URL);
    });
  }
};

export default Navbar;
