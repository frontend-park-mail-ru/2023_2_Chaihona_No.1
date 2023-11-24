import { ROOT_ELEMENT_ID } from '@configs/common_config.js';
import postEdit from '@components/PostEdit/PostEdit.handlebars';

import css from '@components/PostEdit/PostEdit.scss';
import { Api } from '@modules/api';

const BACK_ELEMENT_ID = 'back';
const PUBLISH_ELEMENT_ID = 'publish';
const THEME_INPUT_ID = 'theme';
const TEXT_INPUT_ID = 'text';

const PARAMS_ERROR_CLASS = '.post-edit__params-error';
const SUB_ERROR_CLASS = '.post-edit__sub-params-error';

export default async () => {
  const api = new Api();

  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = postEdit({ new: true, sub_levels: window.sub_levels });
  const backElement = document.getElementById(BACK_ELEMENT_ID);
  const headerEl = document.getElementById(THEME_INPUT_ID);
  const bodyEl = document.getElementById(TEXT_INPUT_ID);

  backElement.addEventListener('click', () => {
    window.history.back();
  });

  if (window.history.state !== null && window.history.state.post !== undefined) {
    const lastEditedPost = window.history.state.post;
    headerEl.value = lastEditedPost.header;
    bodyEl.value = lastEditedPost.body;
    if (lastEditedPost.level) {
      const subEl = document.getElementById(`${lastEditedPost.level}level`);
      subEl.checked = true;
    }
  }

  [headerEl, bodyEl].forEach((changableEl) => changableEl.addEventListener('input', () => {
    const levelEl = document.querySelector('input:checked');
    let level = null;
    if (levelEl) {
      level = levelEl.id[0];
    }
    const newData = { post: { header: headerEl.value, body: bodyEl.value, level } };
    window.history.replaceState(newData, null, window.location.pathname);
  }));

  const levelChangeEl = document.querySelectorAll('.post-edit__sub-params-available-sub');

  levelChangeEl.forEach((levelChange) => levelChange.addEventListener('click', () => {
    const levelEl = document.querySelector('input:checked');
    let level = null;
    if (levelEl) {
      level = levelEl.id[0];
    }
    const newData = { post: { header: headerEl.value, body: bodyEl.value, level } };
    window.history.replaceState(newData, null, window.location.pathname);
  }));
  let pinned = [];

  const attachesEl = document.querySelector('.attaches');
  const uploadImgButton = document.getElementById('upload-img');

  uploadImgButton.addEventListener('change', (e) => {
      Array.prototype.forEach.call(e.target.files, (file) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const upImage = reader.result;
          const image = new Image();
          image.height = 100;
          image.title = file.name;
          image.src = upImage;
          attachesEl.appendChild(image);
          pinned.push({
            'data': btoa(upImage),
            'name': pinned.length+'.png',
          });
        });
        reader.readAsDataURL(file);
      });
  });

  const uploadVideoButton = document.getElementById('upload-video');

  uploadVideoButton.addEventListener('change', (e) => {
      Array.prototype.forEach.call(e.target.files, (file) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const upVideo = reader.result;
          const video = document.createElement('video');
          video.height = 100;
          video.title = file.name;
          video.src = upVideo;
          video.controls = true;
          attachesEl.appendChild(video);
          pinned.push({
            'data': btoa(upVideo),
            'name': pinned.length+'.mp4',
          });
        });
        reader.readAsDataURL(file);
      });
  });

  const uploadAudioButton = document.getElementById('upload-audio');

  uploadAudioButton.addEventListener('change', (e) => {
      Array.prototype.forEach.call(e.target.files, (file) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const upAudio = reader.result;
          const audio = document.createElement('audio');
          audio.title = file.name;
          audio.src = upAudio;
          audio.controls = true;
          attachesEl.appendChild(audio);
          pinned.push({
            'data': btoa(upAudio),
            'name': pinned.length+'.mp3',
          });
        });
        reader.readAsDataURL(file);
      });
  });

  const uploadFileButton = document.getElementById('upload-file');

  uploadFileButton.addEventListener('change', (e) => {
      Array.prototype.forEach.call(e.target.files, (file) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const upFile = reader.result;
          const doc = document.createElement('a');
          doc.title = file.name;
          doc.text += file.name;
          doc.addEventListener('click', (e) => {
            download(upFile);
          });
          doc.href = upFile;
          attachesEl.appendChild(doc);
          pinned.push({
            'data': btoa(upFile),
            'name': pinned.length+'.txt',
          });
        });
        reader.readAsDataURL(file);
      });
  });

  const verifyButton = document.getElementById(PUBLISH_ELEMENT_ID);
  verifyButton.addEventListener('click', () => {
    const header = headerEl.value;
    const body = bodyEl.value;
    const postTags = null;
    const checked = document.querySelector('input:checked');
    if (body === '' || header === '') {
      const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
      errorEl.textContent = 'Тема или текст поста не могут быть пустыми';
    } else if (checked === null) {
      const errorEl = document.querySelector(SUB_ERROR_CLASS);
      errorEl.textContent = 'Выберите уровень доступа';
    } else {
      const min_subscription_level_id = Number(checked.value);
      const attaches = pinned;
      api.newPost({
        header, min_subscription_level_id, body, postTags, attaches
      });
      window.history.back();
    }
  });
};
