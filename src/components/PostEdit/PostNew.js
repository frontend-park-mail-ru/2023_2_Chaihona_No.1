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

  const uploadedImg = document.querySelector('uploaded-img')
  const uploadImgButton = document.getElementById('upload-img');

  let imageAttach = {
    'data': null,
    'name': null,
  };

  uploadImgButton.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const upImage = reader.result;
      uploadedImg.src = upImage;
    })
    imageAttach.data = e.target.files[0];
    imageAttach.name = '1.png';
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
      const attaches = [imageAttach];
      api.newPost({
        header, min_subscription_level_id, body, postTags, attaches
      });
      window.history.back();
    }
  });
};
