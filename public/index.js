import {Router} from "./modules/router.js";
import navbar from "./components/Navbar/Navbar.js";
import {Api} from "./modules/api.js";
importScripts('./modules/requests.js', './configs/link_config.js', './configs/rest_config.js',
            './components/UserProfile/uprofile-prec.js', './components/Target/target-prec.js',
            './components/SubLevel/sub_level-prec.js', './components/Register/register-prec.js',
            './components/Register/register.js', './components/Post/post-prec.js',
            './components/NotFound/notfound.js', './components/NotFound/notfound-prec.js',
            './components/Navbar/Navbar.js', './components/Logout/logout.js',
            './components/Login/login.js', './components/Login/login-prec.js',
            './components/Comment/comment-prec.js', './components/AuthorProfile/profile.js',
            './components/AuthorProfile/aprofile-prec.js'
)

const api = new Api();
const isAuth = await api.isAuth();
const router = new Router();
window.router = router;
router.auth = true;
if (isAuth.data.body.is_authorized === true) {
    navbar({"User": {"id": "1"}});
    router.redirect(window.location.pathname.slice(0, -1));
} else {
    navbar();
    router.redirect('/login');
}
