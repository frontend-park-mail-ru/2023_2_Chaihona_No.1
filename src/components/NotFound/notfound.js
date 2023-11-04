import { ROOT_ELEMENT_ID } from '@configs/common_config.js';
import notfound from '@components/NotFound/notfound.handlebars'

/**
 * Функция отрисовки страницы 404
 */
export default () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = notfound();
};
