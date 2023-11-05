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
    window.addEventListener('click', (event) => {
      const target = event.target.getAttribute('href');
      if (target !== null) {
        event.preventDefault();
        this.redirect(target);
      }
    });

    window.addEventListener('popstate', (event) => {
      const path = window.location.pathname;
      this.redirect(path);
    });
  }

  /**
   * Редиректит пользователя по указанному пути внутри приложения
   * @param path - путь внутри приложения
   * @param state - состояние
   */
  redirect(path) {
    const renderer = path.replace(/[/0-9]*/g, ''); // удалить лишние цифры если ссылка связана с каким-то id (e.g. id профиля)
    let route = routes[renderer];
    if (window.history.state) {
      console.log(window.history.state.data);
    }
    window.history.pushState(null, null, path);
    if (route === undefined) {
      route = routes.notfound;
    }
    route.render();
  }
}
