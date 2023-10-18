import { Api } from '../../modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '../../configs/common_config.js';

const AUTHOR_USER_TYPE = 'creator';
const TARGET_TEMPLATE_NAME = 'target';
const SUB_LEVEL_TEMPLATE_NAME = 'sub_level';
const POST_TEMPLATE_NAME = 'post';
const COMMENT_TEMPLATE_NAME = 'comment';

/**
 * Функция отрисовки страницы пользователя
 */
export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';

  // отрезаем от url id профиля
  const currUrl = window.location.href.split('/').pop();
  const id = currUrl.replace(PROFILE_URL, '');

  // забираем пользователя
  const api = new Api();
  const profileRequest = await api.getUserProfile(id);

  if (profileRequest.status >= MIN_FAIL_RESPONSE) {
    window.router.redirect(NOT_FOUND_URL);
  }

  const profile = profileRequest.data.body.profiles.user;
  // если пользователь автор - забираем посты и рендерим страницу, иначе просто рендерим страницу
  if (profile.user_type === AUTHOR_USER_TYPE) {
    const postsRequest = await api.getUserPosts(id);
    if (postsRequest.status >= MIN_FAIL_RESPONSE) {
      window.router.redirect(NOT_FOUND_URL);
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
    Handlebars.registerPartial(TARGET_TEMPLATE_NAME, Handlebars.templates.target);
    Handlebars.registerPartial(SUB_LEVEL_TEMPLATE_NAME, Handlebars.templates.sub_level);
    Handlebars.registerPartial(COMMENT_TEMPLATE_NAME, Handlebars.templates.comment);
    Handlebars.registerPartial(POST_TEMPLATE_NAME, Handlebars.templates.post);
    rootElement.innerHTML = Handlebars.templates.author_profile(profile);
  } else {
    rootElement.innerHTML = Handlebars.templates.user_profile(profile);
  }
};
