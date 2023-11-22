import {
  ROOT_ELEMENT_ID,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '@configs/common_config.js';
import startPage from '@components/StartPage/StartPage.handlebars';
import { Api } from '@modules/api.js';

import pig from '@static/img/pngwing3.png';
import hand from '@static/img/pngwingHand.png';
import css from './StartPage.scss';

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
    return window.router.redirect('nenahod');
  }

  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = startPage(profiles);
  
  const pigImg = document.getElementById('flourish-pig');
  pigImg.src = pig;

  const handImg = document.getElementById('hand');
  handImg.src = hand;

  const AuthorButton = document.getElementById('author-btn');
  AuthorButton.addEventListener('click', async () => {
    window.router.redirect('/register');
  });
  
  const DonaterButton = document.getElementById('donater-btn');
  DonaterButton.addEventListener('click', async () => {
    window.router.redirect('/register');
  });
  
  const JoinButton = document.getElementById('join-btn');
  JoinButton.addEventListener('click', async () => {
    window.router.redirect('/register');
  });

  for (const topPic of document.querySelectorAll('.start-page__container__profiles__profile__ava')) {
    topPic.src = await api.getAvatar(subPic.dataset.sub);
    topPic.addEventListener('click', () => window.router.redirect(`profile${subPic.dataset.sub}`));
  }
};
