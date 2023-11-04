import { Router } from '@modules/router.js';
import navbar from '@components/Navbar/Navbar.js';
import { Api } from '@modules/api.js';
import { precompiledDir, precompiledFnames } from '@configs/precompiled_config.js';
import css from "./common.css";

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
  if (isAuth.data.body.is_authorized === true) {
    navbar({ User: { id: '0' } });
    window.user = { id: '0' }
    router.redirect('/profile0');
  } else {
    navbar();
    router.redirect('/login');
  }
}

// loadScript('handlebars/dist/handlebars.js');
//await loadPrecompiled();
await init();
