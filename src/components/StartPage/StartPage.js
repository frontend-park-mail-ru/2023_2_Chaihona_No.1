import { ROOT_ELEMENT_ID } from '@configs/common_config.js';
import startPage from '@components/StartPage/StartPage.handlebars';

import pig from '@static/img/pngwing3.png';
import hand from '@static/img/pngwingHand.png';
// import css from './StartPage.scss';

/**
 * Функция отрисовки стартовой страницы 
 */
export default () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = startPage();
  const pigImg = document.getElementById('flourish-pig');
  pigImg.src = pig;
  const handImg = document.getElementById('hand');
  handImg.src = handImg;
};
