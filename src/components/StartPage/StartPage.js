import {
  ROOT_ELEMENT_ID,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
  MOUSE_CLICK_EVENT,
  REGISTER_URL,
} from '@configs/common_config.js';
import startPage from '@components/StartPage/StartPage.handlebars';
import { Api } from '@modules/api.js';

import pig from '@static/img/pngwing3.png';
import hand from '@static/img/pngwingHand.png';
import css from './StartPage.scss';

const PROFILE_AVA_ID = '.start-page__container__profiles__profile__ava';
const PROFILE_BTN_CLASS = '.start-page__container__profiles__profile__button';

const FLOURISH_PIG_ID = 'flourish-pig';
const HAND_ID = 'hand';
const AUTHOR_BTN = 'author-btn';
const DONATER_BTN_ID = 'donater-btn';
const JOIN_BTN_ID = 'join-btn';

/**
 * Функция отрисовки стартовой страницы
 */
export default async () => {
  const api = new Api();
  const topRequest = await api.getTop(3);

  if (topRequest.status >= MIN_FAIL_RESPONSE) {
    window.router.redirect(NOT_FOUND_URL);
  }

  const { profiles } = topRequest.data.body;
  if (profiles === undefined) {
    return window.router.redirect(NOT_FOUND_URL);
  }

  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = startPage(topRequest.data.body);

  const pigImg = document.getElementById(FLOURISH_PIG_ID);
  pigImg.src = pig;

  const handImg = document.getElementById(HAND_ID);
  handImg.src = hand;

  const AuthorButton = document.getElementById(AUTHOR_BTN);
  AuthorButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
    window.router.redirect('/' + REGISTER_URL);
  });

  const DonaterButton = document.getElementById(DONATER_BTN_ID);
  DonaterButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
    window.router.redirect('/' + REGISTER_URL);
  });

  const JoinButton = document.getElementById(JOIN_BTN_ID);
  JoinButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
    window.router.redirect('/' + REGISTER_URL);
  });

  for (const topPic of document.querySelectorAll(PROFILE_AVA_ID)) {
    topPic.src = await api.getAvatar(topPic.dataset.sub);
    topPic.addEventListener(MOUSE_CLICK_EVENT, () => window.router.redirect(`profile${topPic.dataset.sub}`));
  }
  for (const btn of document.querySelectorAll(PROFILE_BTN_CLASS)) {
    btn.addEventListener(MOUSE_CLICK_EVENT, () => window.router.redirect(`profile${btn.dataset.sub}`));
  }
};
