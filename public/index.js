import {Router} from "./modules/router.js";
import navbar from "./components/Navbar/Navbar.js";
import {Api} from "./modules/api.js";


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



if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then((reg)=>{
            console.log('sw success', reg);
        })
        .catch((error)=>{
            console.log('sw fail', error);
        });
}
