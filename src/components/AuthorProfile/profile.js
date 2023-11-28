import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '@configs/common_config.js';
import post from '@components/Post/post.js';
import donate from '@components/Donate/donate.js';

import aprofile from '@components/AuthorProfile/author_profile.handlebars';
import uprofile from '@components/UserProfile/user_profile.handlebars';

import profileSettingIcon from '@static/icons/Settings2.svg';

// todo: назвать нормально =)
import css from '@components/AuthorProfile/author_profile.scss';
import postCss from '@components/Post/post.scss';
import targetCss from '@components/Target/target.scss';
import uProfileCss from '@components/UserProfile/user_profile.scss';
import commentCss from '@components/Comment/comment.css';
import subLevelCss from '@components/SubLevel/sub_level.scss';


const imgExtRegExp = /(jp(e)?g|png)$/;

function checkImgExtension(imgName) {
  const re = new RegExp(imgExtRegExp);
  return re.test(imgName);
}

/**
 * Функция отрисовки страницы пользователя
 */
export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';

  // отрезаем от url id профиля
  const currUrl = window.location.href.split('/').pop();
  const id = currUrl.replace(PROFILE_URL, '');

  var isOwner = false;
  var isAuthorized = false;
  if (window.user !== undefined) {
    isOwner = (window.user.id === Number(id));
    isAuthorized = true;
  }
  // забираем пользователя
  const api = new Api();
  const profileRequest = await api.getUserProfile(id);

  if (profileRequest.status >= MIN_FAIL_RESPONSE) {
    window.router.redirect(NOT_FOUND_URL);
  }

  const { profile } = profileRequest.data.body;
  if (profile.user.id === 0) {
    return window.router.redirect('nenahod');
  }
  window.sub_levels = profile.subscribe_levels;

  // если пользователь автор - забираем посты и рендерим страницу, иначе просто рендерим страницу
  if (profile.user.is_author) {
    const postsRequest = await api.getUserPosts(id, isOwner, profile.is_followed);
    if (postsRequest.status >= MIN_FAIL_RESPONSE) {
      window.router.redirect(NOT_FOUND_URL);
    }
    profile.posts = postsRequest.data.body.posts;


    if (profile.posts != null) {
      profile.posts.forEach(async (profilePost) => {
        profilePost.isOwner = isOwner;
        const attachRequest = await api.getPostAttaches(profilePost.id);
        if (attachRequest.status >= MIN_FAIL_RESPONSE) {
          window.router.redirect(NOT_FOUND_URL);
        }
        profilePost.attaches = attachRequest.data.body.attaches;
        if (profilePost.attaches !== null && profilePost.attaches !== undefined) {
          profilePost.attaches.forEach((attach, ind) => {
            const attachesEl = document.getElementById('attaches-'+profilePost.id);
            if (attachesEl === null || attachesEl === undefined) {
              return
            }
            if (checkImgExtension(attach.file_path)){
              const image = new Image();
              image.height = 100;
              image.src = atob(attach.data);
              attachesEl.appendChild(image);
              return;
            }
            if (attach.file_path.endsWith(".mp4")){
              const video = document.createElement('video');
              video.height = 100;
              video.src = atob(attach.data);
              video.controls = true;
              attachesEl.appendChild(video);
              return;
            }
            if (attach.file_path.endsWith(".mp3")){
              const audio = document.createElement('audio');
              audio.src = atob(attach.data);
              audio.controls = true;
              attachesEl.appendChild(audio);
              return
            }
            if (attach){
              const doc = document.createElement('a');
              doc.target = "_blank";
              doc.text += attach.name;
              doc.href = URL.createObjectURL(new Blob([atob(attach.data)], {type:"application/octet-stream"}));
              // doc.setAttribute("download", doc.text);
              doc.addEventListener('click', (e) => {
                e.preventDefault();
                const aEl = document.createElement('a');
                aEl.setAttribute("download", e.target.text);
                const href = e.target.href;
                aEl.href = href;
                aEl.setAttribute('target', '_blank');
                aEl.click();
                URL.revokeObjectURL(href);
              });
              attachesEl.appendChild(doc);
              return;
            }
          });
        }
      });
    }

    // может быть профиль без целей
    if (profile.targets !== undefined) {
      profile.targets.forEach((target) => {
        target.doneproc = (target.done / target.target) * 100;
        target.leftproc = 100 - target.doneproc;
      });
    }

    profile.isOwner = isOwner;
    console.log("render");
    const profileWithoutZero = profile;
    profileWithoutZero.subscribe_levels = profileWithoutZero.subscribe_levels.filter((e) => e.level !== 0);
    profileWithoutZero.subscribe_levels = Array.from(profileWithoutZero.subscribe_levels, (level) => {
      level.isOwner = isOwner;
      if (level.id === profile.visiter_subscription_level_id) {
        level.has = true;
      } else {
        level.has = false;
      }
      return level;
    });
    rootElement.innerHTML = aprofile(profileWithoutZero);

    if (isOwner) {
      const newPostButton = document.getElementById('new-post-button');

      newPostButton.addEventListener('click', () => {
        window.router.redirect('newpost');
      });
    } else {
      const tipButton = document.getElementById('tip-button');

      tipButton.addEventListener('click', () => {
        if (!isAuthorized) {
          return window.router.redirect('login');
        }
        const donateModal = document.getElementById('donate-dialog');
        donateModal.showModal();
        donate(id);
      });

      const subButton = document.getElementById('sub_button');

      subButton.addEventListener('click', (event) => {
        if (!isAuthorized) {
          return window.router.redirect('login');
        }
        const subBtn = event.target;
        const { subbed } = subBtn.dataset;
        const subsAmount = document.querySelector('.user-page__subs-amount');
        if (subbed === 'true') {
          subBtn.classList.remove('user-page__ava-btn_clicked');
          subBtn.classList.add('user-page__ava-btn_unclicked');
          subBtn.dataset.subbed = 'false';
          subBtn.textContent = 'Отслеживать';
          subsAmount.textContent = String(Number(subsAmount.textContent) - 1);
          // api.unfollow(profile.subscribe_levels[0].id, id);
          document.querySelectorAll('.sub-level-btn').forEach((btn) => {
            btn.dataset.subbed = 'false';
            btn.textContent = 'Подписаться';
          });
          api.unfollow(profile.visiter_subscription_level_id, id);
        } else {
          subBtn.classList.remove('user-page__ava-btn_unclicked');
          subBtn.classList.add('user-page__ava-btn_clicked');
          subBtn.dataset.subbed = 'true';
          subBtn.textContent = 'Перестать отслеживать';
          subsAmount.textContent = String(Number(subsAmount.textContent) + 1);
          api.follow(profile.subscribe_levels[0].id, id);
        }
      });

      const subLevelBtns = document.querySelectorAll('.sub-level-btn');
      subLevelBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const { subbed } = btn.dataset;
          if (subbed === 'true') {
            btn.dataset.subbed = 'false';
            btn.textContent = 'Подписаться';

            document.getElementById('sub_button').classList.remove('user-page__ava-btn_clicked');
            document.getElementById('sub_button').classList.add('user-page__ava-btn_unclicked');
            document.getElementById('sub_button').dataset.subbed = 'false';
            document.getElementById('sub_button').textContent = 'Отслеживать';
            document.querySelector('.user-page__subs-amount').textContent = String(Number(document.querySelector('.user-page__subs-amount').textContent) - 1);

            api.unfollow(e.target.dataset.id, id);
          } else {
            if (document.getElementById('sub_button').dataset.subbed === 'false') {
              document.getElementById('sub_button').classList.remove('user-page__ava-btn_unclicked');
              document.getElementById('sub_button').classList.add('user-page__ava-btn_clicked');
              document.getElementById('sub_button').dataset.subbed = 'true';
              document.getElementById('sub_button').textContent = 'Перестать отслеживать';
              document.querySelector('.user-page__subs-amount').textContent = String(Number(document.querySelector('.user-page__subs-amount').textContent) + 1);
            }

            const otherBtns = document.querySelectorAll('.sub-level-btn');
            otherBtns.forEach((b) => {
              b.dataset.subbed = 'false';
              b.textContent = 'Подписаться';
            });

            btn.dataset.subbed = 'true';
            btn.textContent = 'Отписаться';


            api.follow(e.target.dataset.id, Number(id), profile.visiter_subscription_id);
          }
        });
      });
    }
    var userAva = "";
    if (window.user !== undefined) {
        userAva = await api.getAvatar(window.user.id);
    }
    post(isOwner, userAva, profile.posts);
  } else {
    profile.isOwner = isOwner;
    rootElement.innerHTML = uprofile(profile);
    for (const subPic of document.querySelectorAll('.user-page__sub-pic')) {
      subPic.src = await api.getAvatar(subPic.dataset.sub);
      subPic.addEventListener('click', () => window.router.redirect(`profile${subPic.dataset.sub}`));
    }
  }

  const avatarElement = document.querySelector('.user-page__ava-img');
  const ava = await api.getAvatar(id);
  if (avatarElement !== null && avatarElement !== undefined) {
    avatarElement.src = ava;
  }

  if (isOwner) {
    const statusSettingButton = document.getElementById('status-setting');
    if (statusSettingButton === null) {
      return
    }
    statusSettingButton.src = profileSettingIcon;
    statusSettingButton.addEventListener('click', () => {
      const dialog = document.getElementById('status_dialog');
      dialog.showModal();
      const statusElement = document.getElementById('user_status');
      const statusData = document.getElementById('status_input');
      statusData.value = statusElement.textContent;
      const statusVerifyButton = document.getElementById('status_save_btn');
      statusVerifyButton.addEventListener('click', async () => {
        await api.setStatus(id, statusData.value);
        dialog.close();
        statusElement.innerHTML = statusData.value;
      });
    });

    if (profile.user.is_author) {
      const aboutSettingButton = document.getElementById('about-setting');
      aboutSettingButton.src = profileSettingIcon;
      aboutSettingButton.addEventListener('click', () => {
        const dialog = document.getElementById('about_dialog');
        dialog.showModal();
        const aboutElement = document.getElementById('user_about');
        const aboutData = document.getElementById('about_input');
        aboutData.value = aboutElement.textContent;
        const statusVerifyButton = document.getElementById('about_save_btn');
        statusVerifyButton.addEventListener('click', async () => {
          await api.setDescription(id, aboutData.value);
          dialog.close();
          aboutElement.innerHTML = aboutData.value;
        });
      });
    }
  }

  if (isAuthorized) {
    const iframe = document.createElement('iframe');
    iframe.src = "http://212.233.89.163:8000/survey";
    iframe.classList.add("frame");
    const left = document.querySelector('.user-page__left-column');
    left.appendChild(iframe);

    const closeBtn = document.createElement('button');
    closeBtn.classList.add("frame__close-button");
    closeBtn.id = "close-frame";
    closeBtn.textContent = "Закрыть окно";
    closeBtn.addEventListener('click', () => {
      left.removeChild(iframe);
      left.removeChild(closeBtn);
    });
    left.appendChild(closeBtn);
  }
};
