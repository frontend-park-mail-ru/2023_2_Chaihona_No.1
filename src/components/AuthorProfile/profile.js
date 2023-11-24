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
          profilePost.attaches.forEach((attach) => {
            const attachesEl = document.getElementById('attaches-'+profilePost.id);
            if (attach.file_path.endsWith(".png")){
              const image = new Image();
              image.height = 100;
              image.src = atob(attach.data);
              attachesEl.appendChild(image);
            }
            if (attach.file_path.endsWith(".mp4")){
              const video = document.createElement('video');
              video.height = 100;
              video.src = atob(attach.data);
              video.controls = true;
              attachesEl.appendChild(video);
            }
            if (attach.file_path.endsWith(".mp3")){
              const audio = document.createElement('audio');
              audio.src = atob(attach.data);
              audio.controls = true;
              attachesEl.appendChild(audio);
            }
            if (attach.file_path.endsWith(".txt")){
              const doc = document.createElement('a');
              doc.target = "_blank";
              doc.text += "attach_" + attach.name;
              doc.href = URL.createObjectURL(new Blob([atob(attach.data)], {type:"application/octet-stream"}));
              doc.setAttribute("download", doc.text);
              doc.addEventListener('click', (e) => {
                e.preventDefault();
                const aEl = document.createElement('a');
                aEl.setAttribute("download", e.target.text + '.txt');
                const href = e.target.href;
                aEl.href = href;
                aEl.setAttribute('target', '_blank');
                aEl.click();
                URL.revokeObjectURL(href);
              });
              attachesEl.appendChild(doc);
            }
            // attachesEl.innerHTML+='<img src='+atob(attach.data)+' class="attach-img">';
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
    rootElement.innerHTML = aprofile(profile);

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
          api.unfollow(profile.subscribe_levels[0].id, id);
        } else {
          subBtn.classList.remove('user-page__ava-btn_unclicked');
          subBtn.classList.add('user-page__ava-btn_clicked');
          subBtn.dataset.subbed = 'true';
          subBtn.textContent = 'Перестать отслеживать';
          subsAmount.textContent = String(Number(subsAmount.textContent) + 1);
          api.follow(profile.subscribe_levels[0].id, id);
        }
      });
    }
    var userAva = "";
    if (window.user !== undefined) {
        userAva = await api.getAvatar(window.user.id);
    }
    post(isOwner, userAva);
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
  avatarElement.src = ava;

  if (isOwner) {
    const statusSettingButton = document.getElementById('status-setting');
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
};
