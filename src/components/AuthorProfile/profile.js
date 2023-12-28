import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
  ROOT_ELEMENT_ID,
  MOUSE_CLICK_EVENT,
  NEWPOST_URL,
  LOGIN_URL,
} from '@configs/common_config.js';
import lupa from '@static/img/lupa.png';
import post from '@components/Post/post.js';
import donate from '@components/Donate/donate.js';

import aprofile from '@components/AuthorProfile/author_profile.handlebars';
import uprofile from '@components/UserProfile/user_profile.handlebars';

import profileSettingIcon from '@static/icons/Settings2.svg';
import documentIcon from '@static/icons/file.svg';

// todo: назвать нормально =)
import css from '@components/AuthorProfile/author_profile.scss';
import postCss from '@components/Post/post.scss';
import targetCss from '@components/Target/target.scss';
import uProfileCss from '@components/UserProfile/user_profile.scss';
// import commentCss from '@components/Comment/comment.css';
import subLevelCss from '@components/SubLevel/sub_level.scss';

const ATTRIBUTE_DOWNLOAD = 'download';

const TARGET_BLANK = '_blank';

const TARGET = 'target';

const EXTENSION_MP4 = '.mp4';
const EXTENSION_MP3 = '.mp3';

const ATTACHES_ID = 'attaches-';
const NEW_POST_BUTTON_ID = 'new-post-button';
const TIP_BUTTON_ID = 'tip-button';
const DONATE_DIALOG_ID = 'donate-dialog';
const SUB_BUTTON_ID = 'sub_button';
const STATUS_SETTING_ID = 'status-setting';
const STATUS_DIALOG = 'status_dialog';
const USER_STATUS = 'user_status';
const STATUS_INPUT = 'status_input';
const STATUS_SAVE_BTN_ID = 'status_save_btn';
const ABOUT_SETTING_ID = 'about-setting';
const ABOUT_DIALOG_ID = 'about_dialog';
const USER_ABOUT_ID = 'user_about';
const ABOUT_INPUT_ID = 'about_input';
const ABOUT_SAVE_BTN_ID = 'about_save_btn';

const POST_BLOCK_CLASS = 'post-block';
const POST_IMAGE_ATTACH_CLASS ='post__image-attach';
const POST_IMAGE_CLASS = 'post-image';
const FILE_CLASS = 'file';
const SUBB_AMOUNT_CLASS = '.user-page__subs-amount';
const AVA_BTN_CLICKED = 'user-page__ava-btn_clicked';
const AVA_BTN_UNCLICKED = 'user-page__ava-btn_unclicked';
const SUB_LEVEL_BTN_CLASS = '.sub-level-btn';
const SUB_PIC_CLASS = '.user-page__sub-pic';
const AVA_IMG_CLASS = '.user-page__ava-img';

const TAG_DIV = 'div';
const TAG_P = 'p';
const TAG_IMG = 'img';
const TAG_VIDEO = 'video';
const TAG_AUDIO = 'audio';
const TAG_BUTTON = 'button';
const TAG_A = 'a';

const TRUE_STRING = 'true';
const FALSE_STRING = 'false';

const imgExtRegExp = /(jp(e)?g|png)$/;

function checkImgExtension(imgName) {
  const re = new RegExp(imgExtRegExp);
  return re.test(imgName);
}

/**
 * Функция отрисовки страницы пользователя
 */
export default async () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
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
    return window.router.redirect(NOT_FOUND_URL);
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
        if (profilePost.has_access) {
          const attachRequest = await api.getPostAttaches(profilePost.id);
          if (attachRequest.status >= MIN_FAIL_RESPONSE) {
            // window.router.redirect(NOT_FOUND_URL);
            return
          }
          profilePost.attaches = attachRequest.data.body.attaches;
        } else {
          profilePost.attaches = null;
        }
        if (profilePost.attaches !== null && profilePost.attaches !== undefined) {
          profilePost.attaches.forEach((attach, ind) => {
            const attachesEl = document.getElementById(ATTACHES_ID+profilePost.id);
            const currAttach = document.createElement(TAG_DIV);
            currAttach.classList.add(POST_BLOCK_CLASS);
            if (attachesEl === null || attachesEl === undefined) {
              return
            }
            if (attach.isMedia === false) {
              const txt = document.createElement(TAG_P);
              txt.textContent = attach.data;
              currAttach.appendChild(txt);
              attachesEl.appendChild(currAttach);
              return;
            }
            if (checkImgExtension(attach.file_path)){
              const image = document.createElement(TAG_IMG);
              image.src = atob(attach.data);
              image.classList.add(POST_IMAGE_ATTACH_CLASS);
              image.classList.add(POST_IMAGE_CLASS);
              currAttach.appendChild(image);
              attachesEl.appendChild(currAttach);
              return;
            }
            if (attach.file_path.endsWith(EXTENSION_MP4)){
              const video = document.createElement(TAG_VIDEO);
              video.classList.add(POST_IMAGE_CLASS);
              video.src = atob(attach.data);
              video.controls = true;
              attachesEl.appendChild(video);
              return;
            }
            if (attach.file_path.endsWith(EXTENSION_MP3)){
              const audio = document.createElement(TAG_AUDIO);
              audio.src = atob(attach.data);
              audio.controls = true;
              attachesEl.appendChild(audio);
              return
            }
            if (attach){
              const doc = document.createElement(TAG_BUTTON);
              doc.classList.add(FILE_CLASS);
              doc.target = TARGET_BLANK;
              const img = document.createElement(TAG_IMG);
              img.src = documentIcon;
              doc.appendChild(img);
              doc.innerHTML = doc.innerHTML + attach.name;
              doc.text = attach.name;
              const file = atob(attach.data);
              const arr = new Uint8Array(file.length);
              for (var i = 0; i < file.length; i++){
                arr[i] = file.charCodeAt(i);
              }
              // doc.href = URL.createObjectURL(new Blob([atob(attach.data)], {type:"application/octet-stream"}));
              doc.href = URL.createObjectURL(new Blob([arr], {type:"application/octet-stream"}));
              doc.addEventListener(MOUSE_CLICK_EVENT, (e) => {
                e.preventDefault();
                const aEl = document.createElement(TAG_A);
                aEl.setAttribute(ATTRIBUTE_DOWNLOAD, e.target.text);
                const href = e.target.href;
                aEl.href = href;
                aEl.setAttribute(TARGET, TARGET_BLANK);
                aEl.click();
                URL.revokeObjectURL(href);
              });
              attachesEl.appendChild(doc);
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
    // const profileWithoutZero = structuredClone(profile);
    const profileWithoutZero = Object.assign({}, profile);
    profileWithoutZero.subscribe_levels = profileWithoutZero.subscribe_levels.filter((e) => e.level !== 0);
    profileWithoutZero.subscribe_levels = Array.from(profileWithoutZero.subscribe_levels, (level) => {
      level.isOwner = isOwner;
      if (level.id === profile.visiter_subscription_level_id && profile.is_followed) {
        level.has = true;
      } else {
        level.has = false;
      }
      return level;
    });
    rootElement.innerHTML = aprofile(profileWithoutZero);

    if (isOwner) {
      const newPostButton = document.getElementById(NEW_POST_BUTTON_ID);

      newPostButton.addEventListener(MOUSE_CLICK_EVENT, () => {
        window.router.redirect(NEWPOST_URL);
      });
    } else {
      const tipButton = document.getElementById(TIP_BUTTON_ID);

      tipButton.addEventListener(MOUSE_CLICK_EVENT, () => {
        if (!isAuthorized) {
          return window.router.redirect(LOGIN_URL);
        }
        const donateModal = document.getElementById(DONATE_DIALOG_ID);
        donateModal.showModal();
        donate(id);
      });

      const subButton = document.getElementById(SUB_BUTTON_ID);

      subButton.addEventListener(MOUSE_CLICK_EVENT, (event) => {
        if (!isAuthorized) {
          return window.router.redirect(LOGIN_URL);
        }
        const subBtn = event.target;
        const { subbed } = subBtn.dataset;
        const subsAmount = document.querySelector(SUBB_AMOUNT_CLASS);
        if (subbed === TRUE_STRING) {
          subBtn.classList.remove(AVA_BTN_CLICKED);
          subBtn.classList.add(AVA_BTN_UNCLICKED);
          subBtn.dataset.subbed = FALSE_STRING;
          subBtn.textContent = 'Отслеживать';
          subsAmount.textContent = String(Number(subsAmount.textContent) - 1);
          // api.unfollow(profile.subscribe_levels[0].id, id);
          document.querySelectorAll(SUB_LEVEL_BTN_CLASS).forEach((btn) => {
            btn.dataset.subbed = FALSE_STRING;
            btn.textContent = 'Подписаться';
          });
          api.unfollow(profile.visiter_subscription_level_id, id);
        } else {
          subBtn.classList.remove(AVA_BTN_UNCLICKED);
          subBtn.classList.add(AVA_BTN_CLICKED);
          subBtn.dataset.subbed = TRUE_STRING;
          subBtn.textContent = 'Перестать отслеживать';
          subsAmount.textContent = String(Number(subsAmount.textContent) + 1);
          api.follow(profile.subscribe_levels[0].id, id);
        }
      });

      const subLevelBtns = document.querySelectorAll(SUB_LEVEL_BTN_CLASS);
      subLevelBtns.forEach((btn) => {
        btn.addEventListener(MOUSE_CLICK_EVENT, async (e) => {
          const { subbed } = btn.dataset;
          if (subbed === TRUE_STRING) {
            btn.dataset.subbed = FALSE_STRING;
            btn.textContent = 'Подписаться';

            document.getElementById(SUB_BUTTON_ID).classList.remove(AVA_BTN_CLICKED);
            document.getElementById(SUB_BUTTON_ID).classList.add(AVA_BTN_UNCLICKED);
            document.getElementById(SUB_BUTTON_ID).dataset.subbed = FALSE_STRING;
            document.getElementById(SUB_BUTTON_ID).textContent = 'Отслеживать';
            document.querySelector(SUBB_AMOUNT_CLASS).textContent = String(Number(document.querySelector(SUBB_AMOUNT_CLASS).textContent) - 1);

            api.unfollow(e.target.dataset.id, id);
          } else {
            if (document.getElementById(SUB_BUTTON_ID).dataset.subbed === FALSE_STRING) {
              document.getElementById(SUB_BUTTON_ID).classList.remove(AVA_BTN_UNCLICKED);
              document.getElementById(SUB_BUTTON_ID).classList.add(AVA_BTN_CLICKED);
              document.getElementById(SUB_BUTTON_ID).dataset.subbed = TRUE_STRING;
              document.getElementById(SUB_BUTTON_ID).textContent = 'Перестать отслеживать';
              document.querySelector(SUBB_AMOUNT_CLASS).textContent = String(Number(document.querySelector(SUBB_AMOUNT_CLASS).textContent) + 1);
            }

            // const otherBtns = document.querySelectorAll('.sub-level-btn');
            // otherBtns.forEach((b) => {
            //   b.dataset.subbed = 'false';
            //   b.textContent = 'Подписаться';
            // });

            // btn.dataset.subbed = 'true';
            // btn.textContent = 'Отписаться';

            profile.visiter_subscription_level_id = e.target.dataset.id;
            const subResponse = await api.follow(e.target.dataset.id, Number(id), profile.visiter_subscription_id);
            if (subResponse.data.body !== undefined) {
              window.location.href = subResponse.data.body.redirect_url;
            }
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
    for (const subPic of document.querySelectorAll(SUB_PIC_CLASS)) {
      subPic.src = await api.getAvatar(subPic.dataset.sub);
      subPic.addEventListener(MOUSE_CLICK_EVENT, () => window.router.redirect(`profile${subPic.dataset.sub}`));
    }

    const emptyImgEl = document.querySelector('.feed__empty__search-img');
    // const emprtSearchEl = document.querySelector('.feed__empty__search-btn');
    emptyImgEl.src = lupa;
    // emprtSearchEl.addEventListener('click', () => {
    //   document.querySelector('.navbar__author-search').click();
    // });
  }

  const avatarElement = document.querySelector(AVA_IMG_CLASS);
  const ava = await api.getAvatar(id);
  if (avatarElement !== null && avatarElement !== undefined) {
    avatarElement.src = ava;
  }

  if (isOwner) {
    const statusSettingButton = document.getElementById(STATUS_SETTING_ID);
    if (statusSettingButton === null) {
      return
    }
    statusSettingButton.src = profileSettingIcon;
    statusSettingButton.addEventListener(MOUSE_CLICK_EVENT, () => {
      const dialog = document.getElementById(STATUS_DIALOG);
      dialog.showModal();
      const statusElement = document.getElementById(USER_STATUS);
      const statusData = document.getElementById(STATUS_INPUT);
      statusData.value = statusElement.textContent;
      const statusVerifyButton = document.getElementById(STATUS_SAVE_BTN_ID);
      statusVerifyButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
        await api.setStatus(id, statusData.value);
        dialog.close();
        statusElement.innerHTML = statusData.value;
      });
    });

    if (profile.user.is_author) {
      const aboutSettingButton = document.getElementById(ABOUT_SETTING_ID);
      aboutSettingButton.src = profileSettingIcon;
      aboutSettingButton.addEventListener(MOUSE_CLICK_EVENT, () => {
        const dialog = document.getElementById(ABOUT_DIALOG_ID);
        dialog.showModal();
        const aboutElement = document.getElementById(USER_ABOUT_ID);
        const aboutData = document.getElementById(ABOUT_INPUT_ID);
        aboutData.value = aboutElement.textContent;
        const statusVerifyButton = document.getElementById(ABOUT_SAVE_BTN_ID);
        statusVerifyButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
          await api.setDescription(id, aboutData.value);
          dialog.close();
          aboutElement.innerHTML = aboutData.value;
        });
      });
    }
  }

  // if (isAuthorized) {
  //   const iframe = document.createElement('iframe');
  //   iframe.src = "http://212.233.89.163:8000/survey";
  //   iframe.classList.add("frame");
  //   const left = document.querySelector('.user-page__left-column');
  //   left.appendChild(iframe);

  //   const closeBtn = document.createElement('button');
  //   closeBtn.classList.add("frame__close-button");
  //   closeBtn.id = "close-frame";
  //   closeBtn.textContent = "Закрыть окно";
  //   closeBtn.addEventListener('click', () => {
  //     left.removeChild(iframe);
  //     left.removeChild(closeBtn);
  //   });
  //   left.appendChild(closeBtn);
  // }
};
