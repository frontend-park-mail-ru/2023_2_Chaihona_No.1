import { Router } from './modules/router.js';
import navbar from './components/Navbar/Navbar.js';
import { Api } from './modules/api.js';

const api = new Api();
const isAuth = await api.isAuth();
const router = new Router();
window.router = router;

// Проверяем, жива ли кука с авторизацией
if (isAuth.data.body.is_authorized === true) {
  navbar({ User: { id: '1' } });
  router.redirect('/profile1');
} else {
  router.redirect('/login');
}
