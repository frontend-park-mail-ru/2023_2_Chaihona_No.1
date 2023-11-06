import {Router} from '@modules/router.js';
import navbar from '@components/Navbar/Navbar.js';
import {Api} from '@modules/api.js';
import {precompiledDir, precompiledFnames} from '@configs/precompiled_config.js';

import css from "./common.scss";

const router = new Router();
window.router = router;

function loadScript(scriptName) {
    const script = document.createElement('script');
    script.src = scriptName;
    script.type = 'text/javascript';
    document.head.appendChild(script);
}

async function loadPrecompiled() {
    precompiledFnames.forEach((precompiledFname) => {
        loadScript(precompiledDir + precompiledFname);
    });
}

async function init() {
    const api = new Api();
    const isAuth = await api.isAuth();
    const url = window.location.href.split('/').pop();

    if (isAuth.data.body.is_authorized === true) {
        window.user = {id: isAuth.data.body.id}
        navbar( {id: isAuth.data.body.id});
    } else {
        navbar();
        return router.redirect('/login');
    }
    if (url !== '') {
        return router.redirect(url);
    } else {
        return router.redirect('/profile' + isAuth.data.body.id);
    }
}

// loadScript('handlebars/dist/handlebars.js');
//await loadPrecompiled();
await init();
