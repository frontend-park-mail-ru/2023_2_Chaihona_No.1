import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '@configs/common_config.js';
import post from '@components/Post/post.js';

import aprofile from '@components/AuthorProfile/author_profile.handlebars'
import uprofile from '@components/UserProfile/user_profile.handlebars'

const AUTHOR_USER_TYPE = 'creator';
const TARGET_TEMPLATE_NAME = 'target';
const SUB_LEVEL_TEMPLATE_NAME = 'sub_level';
const POST_TEMPLATE_NAME = 'post';
const COMMENT_TEMPLATE_NAME = 'comment';

import css from '@components/AuthorProfile/author_profile.css'
import css2 from '@components/Post/post.css'
import css3 from '@components/Target/target.css'
import css4 from '@components/UserProfile/user_profile.css'
import css5 from '@components/UserProfile/user_profile.css'
import css6 from '@components/Comment/comment.css'

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

  const profile = profileRequest.data.body.profile;
  // если пользователь автор - забираем посты и рендерим страницу, иначе просто рендерим страницу
  if (profile.user.user_type === AUTHOR_USER_TYPE) {
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
    // Handlebars.registerPartial(TARGET_TEMPLATE_NAME, Handlebars.templates.target);
    // Handlebars.registerPartial(SUB_LEVEL_TEMPLATE_NAME, Handlebars.templates.sub_level);
    // Handlebars.registerPartial(COMMENT_TEMPLATE_NAME, Handlebars.templates.comment);
    // Handlebars.registerPartial(POST_TEMPLATE_NAME, Handlebars.templates.post);
    rootElement.innerHTML = aprofile(profile);

    const newPostButton = document.getElementById('new-post-button')

    newPostButton.addEventListener('click', () => {
      window.router.redirect('newpost');
    })
    post();
  } else {
    rootElement.innerHTML = uprofile(profile);
  }

  const statusSettingButton = document.getElementById("status-setting");
  statusSettingButton.addEventListener('click', () => {
    const dialog = document.getElementById("status_dialog");
    dialog.showModal();
    const statusElement = document.getElementById("user_status");
    const statusData = document.getElementById("status_input");
    statusData.value = statusElement.textContent;
    const statusVerifyButton = document.getElementById('status_save_btn');
    statusVerifyButton.addEventListener('click', async () => {
      profile.user.status = statusData.value;
      await api.updateProfile(profile);
      dialog.close();
      statusElement.innerHTML = statusData.value;
    })
  });

  if (profile.user.user_type === AUTHOR_USER_TYPE) {
    const aboutSettingButton = document.getElementById("about-setting");
    aboutSettingButton.addEventListener('click', () => {
      const dialog = document.getElementById("about_dialog");
      dialog.showModal();
      const aboutElement = document.getElementById("user_about");
      const aboutData = document.getElementById("about_input");
      aboutData.value = aboutElement.textContent;
      const statusVerifyButton = document.getElementById('about_save_btn');
      statusVerifyButton.addEventListener('click', async () => {
        profile.user.description = aboutData.value;
        await api.updateProfile(profile);
        dialog.close();
        aboutElement.innerHTML = aboutData.value;
      })
    });
  }
};
