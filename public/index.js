import {Router} from "./modules/router.js";
import navbar from "./components/Navbar/Navbar.js";
import {Api} from "./modules/api.js";
import './modules/requests.js';
import './configs/link_config.js';
import './configs/rest_config.js';
import './components/UserProfile/uprofile-prec.js'; 
import './components/Target/target-prec.js';
import './components/SubLevel/sub_level-prec.js'; 
import './components/Register/register-prec.js';
import './components/Register/register.js'; 
import './components/Post/post-prec.js';
import './components/NotFound/notfound.js'; 
import './components/NotFound/notfound-prec.js';
import './components/Navbar/Navbar.js';
import './components/Logout/logout.js';
import './components/Login/login.js';
import './components/Login/login-prec.js';
import'./components/Comment/comment-prec.js'; 
import './components/AuthorProfile/profile.js';
import './components/AuthorProfile/aprofile-prec.js';

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
