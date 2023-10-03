import {Router} from "./modules/router.js";
import navbar from "./components/Navbar/Navbar.js";
import {Api} from "./modules/api.js";

const api = new Api();
const isAuth = await api.isAuth();
const router = new Router();
window.router = router;
router.auth = true;
if (isAuth.data.body.is_authorized === true) {
    console.log(window.location.pathname.slice(0, -1))
    navbar({"User": {"id": "1"}});
    router.redirect(window.location.pathname.slice(0, -1));
} else {
    navbar();
    router.redirect('/login');
}
