import profile from "../components/AuthorProfile/profile.js";
import notfound from "../components/NotFound/notfound.js";
import login from "../components/Login/login.js";
import register from "../components/Register/register.js";
import logout from "../components/Logout/logout.js";

/**
 * Массив объектов с url и функциями отрисовки страниц
 */
export const routes = {
    'profile': {
        render: profile
    },
    'login': {
        render: login
    },
    'register': {
        render: register
    },
    'logout': {
        render: logout
    },
    404: {
        render: notfound
    }
}

