import { Api } from '../../modules/api.js';

/**
 * Функция отрисовки страницы пользователя
 */
export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';

  // отрезаем от url id профиля
  const currUrl = window.location.href.split('/').pop();
  const id = currUrl.replace('profile', '');

  // забираем пользователя
  const api = new Api();
  const profileRequest = await api.getUserProfile(id);

  if (profileRequest.status >= 300) {
    window.router.redirect('nenahod');
  }

  const profile = profileRequest.data.body.profiles.user;
  // если пользователь автор - забираем посты и рендерим страницу, иначе просто рендерим страницу
  if (profile.user_type === 'creator') {
    const postsRequest = await api.getUserPosts(id);
    if (postsRequest.status >= 300) {
      window.router.redirect('nenahod');
    }
    profile.posts = postsRequest.data.body.posts;

    // может быть профиль без целей
    if (profile.targets !== undefined) {
      profile.targets.forEach((target) => {
        target.doneproc = (target.done / target.target) * 100;
        target.leftproc = 100 - target.doneproc;
      });
    }

    // цели, уровни подписки, комменты, и посты лежат в отдельных шаблонах,
    // поэтому подключаются отдельно
    Handlebars.registerPartial('target', Handlebars.templates.target);
    Handlebars.registerPartial('sub_level', Handlebars.templates.sub_level);
    Handlebars.registerPartial('comment', Handlebars.templates.comment);
    Handlebars.registerPartial('post', Handlebars.templates.post);
    rootElement.innerHTML = Handlebars.templates.author_profile(profile);
  } else {
    rootElement.innerHTML = Handlebars.templates.user_profile(profile);
  }
};
