import { Router } from '@modules/router.js';
import navbar from '@components/Navbar/Navbar.js';
import { Api } from '@modules/api.js';
import {url} from '@configs/rest_config';
// importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' })
    .then((reg) => {
      console.log('sw success', reg);
    })
    .catch((error) => {
      console.log('sw fail 2', error);
    });
}

firebase.initializeApp({
  messagingSenderId: '87099817426'
});

// браузер поддерживает уведомления
// вообще, эту проверку должна делать библиотека Firebase, но она этого не делает
if ('Notification' in window) {
  window.messaging = firebase.messaging();
  // пользователь уже разрешил получение уведомлений
  // подписываем на уведомления если ещё не подписали
  // subscribe();
  if (Notification.permission === 'granted') {
  }
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
  if (isAuth.data.body.id !== undefined){
    return router.redirect(`/profile${isAuth.data.body.id}`);
  }
  return router.redirect('/start');
}

await init();
