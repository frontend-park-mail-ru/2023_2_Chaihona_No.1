import { PROFILE_URL, ROOT_ELEMENT_ID } from '@configs/common_config.js';
import postEdit from '@components/PostEdit/PostEdit.handlebars';

import css from '@components/PostEdit/PostEdit.scss';
import { Api } from '@modules/api';
import { MOUSE_CLICK_EVENT } from '../../configs/common_config';

const KEYDOWN_EVENT = 'keydown';
const BLUR_EVENT = 'blur';
const INPUT_EVENT = 'input';
const CHANGE_EVENT = 'change';
const LOAD_EVENT = 'load';

const EDITPOST_URL = 'editpost';

const ATTRIBUTE_DOWNLOAD = 'download';

const TARGET_BLANK = '_blank';

const TARGET = 'target';


const BACK_ELEMENT_ID = 'back';
const PUBLISH_ELEMENT_ID = 'publish';
const THEME_INPUT_ID = 'theme';
const TEXT_INPUT_ID = 'text';
const DELETE_BTN_ID = 'delete-btn-';
const UPLOAD_IMG_ID = 'upload-img';
const UPLOAD_VIDEO = 'upload-video';
const UPLOAD_AUDIO = 'upload-audio';
const UPLOAD_FILE = 'upload-file';

const PARAMS_ERROR_CLASS = '.post-edit__params-error';
const SUB_ERROR_CLASS = '.post-edit__sub-params-error';
const POSST_EDIT_ATTACHES = '.post-edit__attaches';
const POST_BLOCK_CLASS = 'post-block';
const POST_EDIT_ATTACHES_ATTACH = 'post-edit__attaches__attach';
const POST_EDIT_ATTACHES_ATTACH_DELETE_BTN = 'post-edit__attaches__attach__delete-btn';
const POST_IMAGE_CLASS = 'post-image';
const POST_EDIT_SUB_PARAMS_AVAILABLE_SUB_CLASS = '.post-edit__sub-params-available-sub';

const INPUT_CHCKED = 'input:checked';

const ATTRIBUTE_IDX = 'data-idx';
const PINNED_IDX = 'pinned-idx';

const TAG_DIV = 'div';
const TAG_P = 'p';
const TAG_IMG = 'img';
const TAG_VIDEO = 'video';
const TAG_AUDIO = 'audio';
const TAG_BUTTON = 'button';
const TAG_A = 'a';

const TRUE_STRING = 'true';
const FALSE_STRING = 'false';

const ATTRIBURE_PATH = 'path';

const EXEC_SELECT_ALL = 'selectAll';

const OCTET_STREAM_TYPE = 'application/octet-stream';

const EXTENSION_MP4 = '.mp4';
const EXTENSION_MP3 = '.mp3';

const videoExtRegExp = /(mp4)$/;
const audioExtRegExp = /(mp3)$/;
const imgExtRegExp = /(jp(e)?g|png)$/;

let pinned = {};
pinned.size = 0;

let pattaches = [];

pinned.files = [];
pinned.deleted = [];

function checkVideoExtension(videoName) {
  const re = new RegExp(videoExtRegExp);
  return re.test(videoName);
}

function checkAudioExtension(audioName) {
  const re = new RegExp(audioExtRegExp);
  return re.test(audioName);
}

function checkImgExtension(imgName) {
  const re = new RegExp(imgExtRegExp);
  return re.test(imgName);
}


function keyDownListen(event) {
  const postDescription = document.querySelector(POSST_EDIT_ATTACHES);
  if (event.keyCode === 13) {
    let idx = Number(event.target.getAttribute(ATTRIBUTE_IDX));
    while ((idx+1 < postDescription.children.length)) {
      if ((pattaches[idx+1])) {
        if ((pattaches[idx+1].isMedia)) {
          idx = idx + 1;
        } else {
          break;
        }
      }
    }
    event.preventDefault();
    const newPostBlock = document.createElement(TAG_DIV);
    newPostBlock.innerHTML = '<p></p>';
    newPostBlock.classList.add(POST_BLOCK_CLASS);
    newPostBlock.contentEditable = TRUE_STRING;
    newPostBlock.addEventListener(KEYDOWN_EVENT, keyDownListen);
    newPostBlock.addEventListener(BLUR_EVENT, changeListen);
    newPostBlock.setAttribute(ATTRIBUTE_IDX, String(idx+1));
    newPostBlock.setAttribute(PINNED_IDX, String(pinned.files.length));
    let focus = idx+1;
    if (idx === postDescription.children.length - 1) {
      postDescription.appendChild(newPostBlock);
      pinned.files.push({
        data: newPostBlock.textContent,
        name: 'text',
        isMedia: false,
      });
    } else {
      postDescription.insertBefore(newPostBlock, postDescription.children[idx+1]);
      pinned.files.splice(idx+1, 0, {
        data: newPostBlock.textContent,
        name: 'text',
        isMedia: false,
      });
      for (let i = idx + 2; i<=postDescription.children.length-1; i++) {
        postDescription.children.item(i).setAttribute(ATTRIBUTE_IDX, String(i));
      }
    }
    const abc = postDescription.children.item(focus);
    abc.focus();
  }
  if ((event.keyCode === 8) && (postDescription.children.length > 1)) {
    if (event.target.textContent === '') {
      let idx = Number(event.target.getAttribute(ATTRIBUTE_IDX));
      let pinnedIdx = Number(event.target.getAttribute(PINNED_IDX));
      let fpath = event.target.getAttribute(ATTRIBURE_PATH);
      //pinned[idx] = undefined;
      event.preventDefault();
      event.target.remove();
      idx = idx-1;
      if (fpath) {
        pinned.deleted.push(fpath);
      } else {
        delete pinned.files[Number(pinnedIdx)];
      }
      //while (pinned[idx] === undefined) {
       // idx = idx - 1;
      //}
      const abc = postDescription.children.item(idx);
      abc.focus();
      document.execCommand(EXEC_SELECT_ALL, false, null);
      document.getSelection().collapseToEnd();
    }
  }
}

function changeListen (event) {
    const idx = Number(event.target.getAttribute(PINNED_IDX));
    if (pinned.files[idx]) {
      pinned.files[idx].data = event.target.children[0].textContent;
    }
}


function createDeleteBtn(parent, attach, pinned, isNew) {
  const deleteBtn = document.createElement(TAG_BUTTON);
  deleteBtn.classList.add(POST_EDIT_ATTACHES_ATTACH_DELETE_BTN);
  deleteBtn.id = DELETE_BTN_ID + pinned.files.length;
  deleteBtn.name = pinned.files.length;
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener(MOUSE_CLICK_EVENT, (e) => {
    parent.parentNode.removeChild(parent);
    const file = new Blob([atob(attach.data)], {type: OCTET_STREAM_TYPE})
    pinned.size -= file.size;
    if (!isNew) {
      pinned.deleted.push(attach.file_path);
    } else {
      delete pinned.files[Number(e.target.name)];
    }
  });
  return deleteBtn;
}

function renderAttaches(attaches, pinned) {
  if (attaches !== null && attaches !== undefined) {
    attaches.forEach((attach, ind) => {
      const attachesEl = document.querySelector(POSST_EDIT_ATTACHES);
      if (attachesEl === null || attachesEl === undefined) {
        return
      }
      const div = document.createElement(TAG_DIV);
      div.classList.add(POST_EDIT_ATTACHES_ATTACH);
      div.classList.add(POST_BLOCK_CLASS);
      div.addEventListener(KEYDOWN_EVENT, keyDownListen);
      div.addEventListener(BLUR_EVENT, changeListen);
      div.setAttribute(ATTRIBUTE_IDX, String(ind));

      if (attach.isMedia === false) {
        div.contentEditable = TRUE_STRING;
        const txt = document.createElement(TAG_P);
        div.setAttribute(ATTRIBURE_PATH, attach.file_path);
        txt.textContent = attach.data;
        div.appendChild(txt);
        attachesEl.appendChild(div);
        return;
      }

      if (checkImgExtension(attach.file_path)){
        const image = new Image();
        image.classList.add(POST_IMAGE_CLASS);
        image.src = atob(attach.data);

        const file = new Blob([atob(attach.data)], {type: OCTET_STREAM_TYPE})
        pinned.size += file.size;

        const deleteBtn = createDeleteBtn(div, attach, pinned, false);

        div.appendChild(image);
        div.appendChild(deleteBtn);
        attachesEl.appendChild(div);
        return;
      }
      if (attach.file_path.endsWith(EXTENSION_MP4)){
        const video = document.createElement(TAG_VIDEO);
        video.height = 100;
        video.src = atob(attach.data);
        video.controls = true;

        const file = new Blob([atob(attach.data)], {type: OCTET_STREAM_TYPE})
        pinned.size += file.size;

        const deleteBtn = createDeleteBtn(div, attach, pinned, false);

        div.appendChild(deleteBtn);
        div.appendChild(video);
        attachesEl.appendChild(div);
        return;
      }
      if (attach.file_path.endsWith(EXTENSION_MP3)){
        const audio = document.createElement(TAG_AUDIO);
        audio.src = atob(attach.data);
        audio.controls = true;

        const file = new Blob([atob(attach.data)], {type: OCTET_STREAM_TYPE})
        pinned.size += file.size;

        const deleteBtn = createDeleteBtn(div, attach, pinned, false);

        div.appendChild(deleteBtn);
        div.appendChild(audio);
        attachesEl.appendChild(div);
        return;
      }
      if (attach){
        const doc = document.createElement(TAG_A);
        doc.target = TARGET_BLANK;
        doc.text += attach.name;
        // const file = new Blob([atob(attach.data)], {type:"application/octet-stream"})
        // // doc.href = URL.createObjectURL(file);
        const file = atob(attach.data);
        const arr = new Uint8Array(file.length);
        for (var i = 0; i < file.length; i++){
          arr[i] = file.charCodeAt(i);
        }
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

        pinned.size += file.size;

        const deleteBtn = createDeleteBtn(div, attach, pinned, false);

        div.appendChild(deleteBtn);
        div.appendChild(doc);
        attachesEl.appendChild(div);
        return;
      }
    });
  }
}

export default async () => {
  pinned = {};
  pinned.size = 0;

  pattaches = [];

  pinned.files = [];
  pinned.deleted = [];

  const api = new Api();
  const currUrl = window.location.href.split('/').pop();
  const id = currUrl.replace(EDITPOST_URL, '');
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = postEdit({ new: false, sub_levels: window.sub_levels });
  const backElement = document.getElementById(BACK_ELEMENT_ID);
  const headerEl = document.getElementById(THEME_INPUT_ID);
  const bodyEl = document.getElementById(TEXT_INPUT_ID);
  const tagEl = document.getElementById('tags');
  backElement.addEventListener(MOUSE_CLICK_EVENT, () => {
    window.history.back();
    return;
  });

  [headerEl].forEach((changableEl) => changableEl.addEventListener(INPUT_EVENT, () => {
    const level = document.querySelector(INPUT_CHCKED).id[0];
    //const newData = { post: { header: headerEl.value, body: bodyEl.value, level } };
    window.history.replaceState(newData, null, window.location.pathname);
  }));

  const levelChangeEl = document.querySelectorAll(POST_EDIT_SUB_PARAMS_AVAILABLE_SUB_CLASS);

  levelChangeEl.forEach((levelChange) => levelChange.addEventListener(MOUSE_CLICK_EVENT, () => {
    const level = document.querySelector(INPUT_CHCKED).id[0];
    const newData = { post: { header: headerEl.value, body: bodyEl.value, level } };
    window.history.replaceState(newData, null, window.location.pathname);
  }));

  if (window.post !== undefined) {
    headerEl.value = window.post.header.trim();
    const subEl = document.getElementById(`${window.post.level}level`);
    subEl.checked = true;
    pattaches = window.post.attaches;
    renderAttaches(window.post.attaches, pinned);
    const newData = { post: {
      header: headerEl.value,
      level: window.post.level,
      attaches: window.post.attaches,
      tags: window.post.tags,
    } };
    window.history.replaceState(newData, null, window.location.pathname);
    tagEl.value = window.post.tags.map((e) => e.name).join(' ');
    delete window.post;
  } else if (window.history.state.post !== undefined) {
    const lastEditedPost = window.history.state.post;
    headerEl.value = lastEditedPost.header;
    const subEl = document.getElementById(`${lastEditedPost.level}level`);
    subEl.checked = true;
    renderAttaches(lastEditedPost.attaches, pinned);
    tagEl.value = lastEditedPost.tags.join(' ');
  }

  const attachesEl = document.querySelector(POSST_EDIT_ATTACHES);
  const uploadImgButton = document.getElementById(UPLOAD_IMG_ID);

  uploadImgButton.addEventListener(CHANGE_EVENT, (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener(LOAD_EVENT, () => {
        const div = document.createElement(TAG_DIV);
        div.classList.add(POST_EDIT_ATTACHES_ATTACH);

        const upImage = reader.result;
        const image = new Image();
        image.height = 100;
        image.title = file.name;
        image.src = upImage;

        const attach = {
          data: btoa(upImage),
          name: file.name,
          isMedia: true,
        };
        const deleteBtn = createDeleteBtn(div, attach, pinned, true);

        div.appendChild(deleteBtn);
        div.appendChild(image);
        attachesEl.appendChild(div);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.files.push(attach);
        pinned.size += file.size;
      });
      if (file && file.name) {
        if (!checkImgExtension(file.name)) {
          errorElement.textContent = 'Картинка должна быть в разрешении jp(e)g или png';
          file = null;
          isError = true;
          return;
        }
        if (pinned.size + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.files.length >= 10) {
          errorElement.textContent = 'Нельзя прикрепить больше 10 вложений';
          file = null;
          isError = true;
          return;
        }
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  });

  const uploadVideoButton = document.getElementById(UPLOAD_VIDEO);

  uploadVideoButton.addEventListener(CHANGE_EVENT, (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener(LOAD_EVENT, () => {
        const div = document.createElement(TAG_DIV);
        div.classList.add(POST_EDIT_ATTACHES_ATTACH);

        const upVideo = reader.result;
        const video = document.createElement(TAG_VIDEO);
        video.height = 100;
        video.title = file.name;
        video.src = upVideo;
        video.controls = true;

        const attach = {
          data: btoa(upVideo),
          name: file.name,
          isMedia: true,
        };
        const deleteBtn = createDeleteBtn(div, attach, pinned, true);

        div.appendChild(deleteBtn);
        div.appendChild(video);
        attachesEl.appendChild(div);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.files.push(attach);
        pinned.size += file.size;
      });
      if (file && file.name) {
        if (!checkVideoExtension(file.name)) {
          errorElement.textContent = 'Видео должно быть в разрешении mp4';
          file = null;
          isError = true;
          return;
        }
        if (pinned.size + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.files.length >= 10) {
          errorElement.textContent = 'Нельзя прикрепить больше 10 вложений';
          file = null;
          isError = true;
          return;
        }
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  });

  const uploadAudioButton = document.getElementById(UPLOAD_AUDIO);

  uploadAudioButton.addEventListener(CHANGE_EVENT, (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener(LOAD_EVENT, () => {
        const div = document.createElement(TAG_DIV);
        div.classList.add(POST_EDIT_ATTACHES_ATTACH);

        const upAudio = reader.result;
        const audio = document.createElement(TAG_AUDIO);
        audio.title = file.name;
        audio.src = upAudio;
        audio.controls = true;

        const attach = {
          data: btoa(upAudio),
          name: file.name,
          isMedia: true,
        };
        const deleteBtn = createDeleteBtn(div, attach, pinned, true);

        div.appendChild(deleteBtn);
        div.appendChild(audio);
        attachesEl.appendChild(div);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.files.push(attach);
        pinned.size += file.size;
      });
      if (file && file.name) {
        if (!checkAudioExtension(file.name)) {
          errorElement.textContent = 'Аудио должна быть в разрешении mp3';
          file = null;
          isError = true;
          return;
        }
        if (pinned.size + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.files.length >= 10) {
          errorElement.textContent = 'Нельзя прикрепить больше 10 вложений';
          file = null;
          isError = true;
          return;
        }
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  });

  const uploadFileButton = document.getElementById(UPLOAD_FILE);

  uploadFileButton.addEventListener(CHANGE_EVENT, (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener(LOAD_EVENT, () => {
        const div = document.createElement(TAG_DIV);
        div.classList.add(POST_EDIT_ATTACHES_ATTACH);

        const upFile = reader.result;
        const doc = document.createElement(TAG_A);
        doc.title = file.name;
        doc.text += file.name;
        doc.target = TARGET_BLANK;
        // doc.href = URL.createObjectURL(new Blob([upFile], {type:"application/octet-stream"}));
        const arr = new Uint8Array(upFile.length);
        for (var i = 0; i < upFile.length; i++){
          arr[i] = upFile.charCodeAt(i);
        }
        doc.href = URL.createObjectURL(new Blob([arr], {type: OCTET_STREAM_TYPE}));
        doc.addEventListener(MOUSE_CLICK_EVENT, (e) => {
          e.preventDefault();
          const aEl = document.createElement(TAG_A);
          aEl.setAttribute(ATTRIBUTE_DOWNLOAD, file.name);
          const href = e.target.href;
          aEl.href = href;
          aEl.setAttribute(TARGET, TARGET_BLANK);
          aEl.click();
          URL.revokeObjectURL(href);
        });

        const attach = {
          data: btoa(upFile),
          name: file.name,
          isMedia: true,
        };
        const deleteBtn = createDeleteBtn(div, attach, pinned, true);

        div.appendChild(deleteBtn);
        div.appendChild(doc);
        attachesEl.appendChild(div);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.files.push(attach);
        pinned.size += file.size;
      });
      if (file && file.name) {
        if (pinned.size + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.files.length >= 10) {
          errorElement.textContent = 'Нельзя прикрепить больше 10 вложений';
          file = null;
          isError = true;
          return;
        }
        reader.readAsBinaryString(file);
      }
    });
    e.target.value = '';
  });

  backElement.addEventListener(MOUSE_CLICK_EVENT, () => {
    window.router.redirect(`profile${window.user.id}`);
  });

  const verifyButton = document.getElementById(PUBLISH_ELEMENT_ID);
  verifyButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
    const header = headerEl.value;
    const body = '';
    const min_subscription_level_id = Number(document.querySelector(INPUT_CHCKED).value);
    if (header === '') {
      const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
      errorEl.textContent = 'Тема или текст поста не могут быть пустыми';
    } else {
      pinned.files = pinned.files.filter(i => i !== undefined && i !==null);
      const postTagsEl = document.getElementById('tags');
      const postTags = postTagsEl.value.split(' ').filter((el) => el !== '').map((el) => {
        return {name: el};
      });
      const editRequest = await api.editPost({
        header,
        min_subscription_level_id,
        body,
        tags: postTags,
        id,
        pinned,
      });
      if (editRequest.status >= 400) {
        const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
        if (editRequest.status === 521) {
          errorEl.textContent = 'Ошибка: нет подключения к Интернету!';
          return;
        }
        errorEl.textContent = "Произошла ошибка при редактировании поста, попробуйте позже";
        return;
      }
      delete window.post;
      window.router.redirect(`profile${window.user.id}`);
    }
  });
};
