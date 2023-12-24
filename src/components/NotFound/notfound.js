import { ROOT_ELEMENT_ID } from '@configs/common_config.js';
import notfound from '@components/NotFound/notfound.handlebars';

import agentCooper from '@static/img/agent_cooper.png';
import css from './not_found.scss';

const UW_IMG_CLASS = 'uw-img';

/**
 * Функция отрисовки страницы 404
 */
export default () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = notfound();
  const uwImg = document.getElementById(UW_IMG_CLASS);
  uwImg.src = agentCooper;
};
