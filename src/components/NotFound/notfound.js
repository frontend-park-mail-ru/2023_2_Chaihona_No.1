import { ROOT_ELEMENT_ID } from '@configs/common_config.js';
import notfound from '@components/NotFound/notfound.handlebars'

import css from './not_found.css'
import agentCooper from '@static/img/agent_cooper.png'

/**
 * Функция отрисовки страницы 404
 */
export default () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = notfound();
  const uwImg = document.getElementById('uw-img');
  uwImg.src = agentCooper;
};
