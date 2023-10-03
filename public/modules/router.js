import {routes} from "../configs/link_config.js";

export class Router {
    constructor() {
        window.addEventListener('click', (e) => {
            const target = e.target.getAttribute("href");
            if (target !== null) {
                e.preventDefault();
                this.redirect(target);
            }
        });

        window.addEventListener('popstate', () => {
            const path = window.location.pathname;
            this.redirect(path);
        });
    }

    redirect(path) {
        const renderer = path.replace(/[/0-9]*/g, ""); //удалить лишние цифры если ссылка связана с каким-то id (e.g. id профиля)
        let route = routes[renderer];
        // console.log(renderer)
        if (renderer === 'profile') {
            const id = path.slice(8);
            // console.log(id);
        }
        window.history.pushState(null, null, path);
        if (route === undefined) {
            route = routes[404]
        }
        route.render();
    }
}