import { Router } from './modules/router.js'; 
import navbar from './components/Navbar/Navbar.js';
import { Api } from './modules/api.js';
import { precompiledDir, precompiledFnames } from './configs/precompiled_config.js';

const router = new Router();
window.router = router;

function loadScript (scriptName) {
    var script = document.createElement('script')
    script.src = scriptName;  
    script.type = 'text/javascript';
    document.head.appendChild(script);
}


function loadPrecompiled () {
    precompiledFnames.forEach(function(precompiledFname){
        loadScript(precompiledDir + precompiledFname);  
    })  
}


async function init () {
    const api = new Api();
    const isAuth = await api.isAuth();
    if (isAuth.data.body.is_authorized === true) {
        navbar({ User: { id: '1' } });
        router.redirect('/profile1');
      } else {
        navbar();
        router.redirect('/login');
    }
}

loadScript('handlebars/dist/handlebars.js');
loadPrecompiled();
init();
