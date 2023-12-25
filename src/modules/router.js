import { routes } from '@configs/link_config.js';

/**
 * Класс роутинга по приложению
 * @class
 */
export class Router {
  /**
   * Добавляет в окно обработчики перехода по ссылке и нажатия на стрелки вперёд/назад
   * @constructor
   */
  constructor() {
    /**
     * Добавляет обработку нажатия на ссылуи
     */
    window.addEventListener('click', (event) => {
      const target = event.target.getAttribute('href');
      if (target !== null) {
        event.preventDefault();
        this.redirect(target);
      }
    });

    /**
     * Добавляет обработку нажатия на стрелки
     */
    window.addEventListener('popstate', (event) => {
      const path = window.location.pathname;
      this.redirect(path, window.history.state);
    });
  }

  /**
   * Редиректит пользователя по указанному пути внутри приложения
   * @param path - путь внутри приложения
   * @param state - состояние
   */
  redirect(path, state = null, suffix = null) {
    const bodyElement = document.body;
    bodyElement.classList.add('page-is-changing');
    bodyElement.classList.add('page-not-done');
    document.querySelector('.cd-loading-bar')
      .addEventListener('transitionend', () => {
        const renderer = path.replace(/[/0-9]*/g, ''); // удалить лишние цифры если ссылка связана с каким-то id (e.g. id профиля)
        let route = routes[renderer];
        if (!path.startsWith('blob')) {
          window.history.pushState(state, null, path);
          if (route === undefined) {
            route = routes.notfound;
          }
          setTimeout(() => {
            bodyElement.classList.remove('page-is-changing');
          }, 1200);
          setTimeout(() => {
            bodyElement.classList.remove('page-not-done');
          }, 1800);
          if (renderer === 'feed') {
            route.render(suffix);
          } else {
            return route.render();
          }
        }
      }, { once: true });
  }
}
