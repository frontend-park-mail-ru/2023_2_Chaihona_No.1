import './feed.scss';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
  ROOT_ELEMENT_ID,
  MOUSE_CLICK_EVENT,
  NEWPOST_URL,
} from '@configs/common_config.js';
import feed from '@components/Feed/feed.handlebars';
import post from '@components/Post/post.js';
import { Api } from '@modules/api.js';

const imgExtRegExp = /(jp(e)?g|png)$/;

const OCTET_STREAM_TYPE = 'application/octet-stream';

const ATTRIBUTE_DOWNLOAD = 'download';

const TARGET_BLANK = '_blank';

const TARGET = 'target';

const FEED_EMPTY_CLASS = '.feed__empty';
const POST_BLOCK = 'post-block';
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

const ATTACHES_ID = 'attaches-';

const EXTENSION_MP4 = '.mp4';
const EXTENSION_MP3 = '.mp3';

const TAG_DIV = 'div';
const TAG_P = 'p';
const TAG_IMG = 'img';
const TAG_VIDEO = 'video';
const TAG_AUDIO = 'audio';
const TAG_BUTTON = 'button';
const TAG_A = 'a';

function checkImgExtension(imgName) {
  const re = new RegExp(imgExtRegExp);
  return re.test(imgName);
}

export default async (tag = null) => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  const api = new Api();
  let response = null;
  if (tag === null) {
    response = await api.getFeed();
  } else {
    response = await api.gePostsByTag(tag);
  }
  rootElement.innerHTML = feed(response.data.body);
  const emptyElement = document.querySelector(FEED_EMPTY_CLASS);
  if (response.data.body === null ) {
    emptyElement.textContent = 'Нет соединения с интернетом';
  }
  if (response.data.body.posts === null) {
    emptyElement.textContent = 'У вас ещё нет подписок';
  }

  if (response.data.body.posts !== null) {
    response.data.body.posts.forEach(async (profilePost) => {
      if (profilePost.has_access) {
        const attachRequest = await api.getPostAttaches(profilePost.id);
        if (attachRequest.status >= 399) {
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
          currAttach.classList.add(POST_BLOCK);
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
            doc.href = URL.createObjectURL(new Blob([arr], {type:OCTET_STREAM_TYPE}));
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

  const ava = await api.getAvatar(window.user.id);
  post(false, ava, true, true);
};
