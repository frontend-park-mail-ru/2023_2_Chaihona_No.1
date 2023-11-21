import { Router } from '@modules/router.js';
import navbar from '@components/Navbar/Navbar.js';
import { Api } from '@modules/api.js';
import {url} from '@configs/rest_config';

if (module.hot) {
  module.hot.accept();
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration(url)
    .then(registrations => {
      if (registrations !== undefined) {
          registrations.update();
      }
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('sw success', reg);
        })
        .catch((error) => {
          console.log('sw fail 2', error);
        });
    });
}


const router = new Router();
window.router = router;

async function init() {
  const api = new Api();
  const isAuth = await api.isAuth();
  const url = window.location.href.split('/')
    .pop();

  if (isAuth.data.body.is_authorized === true) {
    window.user = { id: isAuth.data.body.id };
    await navbar({ id: isAuth.data.body.id });
  } else {
    await navbar();
   // if (url !== 'register' && url !== 'login') {
   //   return router.redirect('/login');
   // }
  }
  if (url !== '') {
    return router.redirect(url);
  }
  return router.redirect(`/profile${isAuth.data.body.id}`);
}

await init();
