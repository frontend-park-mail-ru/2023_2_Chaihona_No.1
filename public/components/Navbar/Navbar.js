/**
 * Отрисовка навбара
 * @param user - пользователь. Если его нет, отрисует навбар с регистрацией,
 * иначе отрисует навбар с его данными.
 */
export default (user = null) => {
  const navbarElement = document.querySelector('#navbar');
  navbarElement.innerHTML = '';
  if (user) {
    navbarElement.innerHTML = Handlebars.templates.navbar({ User: { id: '1' } });
  } else {
    navbarElement.innerHTML = Handlebars.templates.navbar();
    const loginBtn = document.querySelector('#login-btn');

    loginBtn.addEventListener('click', () => {
      window.router.redirect('/login');
    });
    const regBtn = document.querySelector('#reg-btn');
    regBtn.addEventListener('click', () => {
      window.router.redirect('/register');
    });
  }
  const mainBtn = document.querySelector('.main-page-btn');
  mainBtn.addEventListener('click', () => {
    window.router.redirect('/nenahod');
  });
};
