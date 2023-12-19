import { PROFILE_URL, ROOT_ELEMENT_ID } from '@configs/common_config.js';
import postEdit from '@components/PostEdit/PostEdit.handlebars';

import css from '@components/PostEdit/PostEdit.scss';
import { Api } from '@modules/api';

const BACK_ELEMENT_ID = 'back';
const PUBLISH_ELEMENT_ID = 'publish';
const THEME_INPUT_ID = 'theme';
const TEXT_INPUT_ID = 'text';

const PARAMS_ERROR_CLASS = '.post-edit__params-error';
const SUB_ERROR_CLASS = '.post-edit__sub-params-error';

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
  const postDescription = document.querySelector('.post-edit__attaches');
  if (event.keyCode === 13) {
    let idx = Number(event.target.getAttribute('data-idx'));
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
    const newPostBlock = document.createElement("div");
    newPostBlock.innerHTML = '<p></p>';
    newPostBlock.classList.add('post-block');
    newPostBlock.contentEditable = 'true';
    newPostBlock.addEventListener('keydown', keyDownListen);
    newPostBlock.addEventListener('blur', changeListen);
    newPostBlock.setAttribute('data-idx', String(idx+1));
    newPostBlock.setAttribute('pinned-idx', String(pinned.files.length));
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
        postDescription.children.item(i).setAttribute('data-idx', String(i));
      }
    }
    console.log('focus = ', focus);
    const abc = postDescription.children.item(focus);
    abc.focus();
  }
  if ((event.keyCode === 8) && (postDescription.children.length > 1)) {
    if (event.target.textContent === '') {
      let idx = Number(event.target.getAttribute('data-idx'));
      let pinnedIdx = Number(event.target.getAttribute('pinned-idx'));
      let fpath = event.target.getAttribute('path');
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
      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    }
  }
}

function changeListen (event) {
    const idx = Number(event.target.getAttribute('pinned-idx'));
    if (pinned.files[idx]) {
      pinned.files[idx].data = event.target.children[0].textContent;
    }
}


function createDeleteBtn(parent, attach, pinned, isNew) {
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('post-edit__attaches__attach__delete-btn');
  deleteBtn.id = 'delete-btn-' + pinned.files.length;
  deleteBtn.name = pinned.files.length;
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', (e) => {
    parent.parentNode.removeChild(parent);
    const file = new Blob([atob(attach.data)], {type:"application/octet-stream"})
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
      const attachesEl = document.querySelector(".post-edit__attaches");
      if (attachesEl === null || attachesEl === undefined) {
        return
      }
      const div = document.createElement('div');
      div.classList.add('post-edit__attaches__attach');
      div.classList.add('post-block');
      div.addEventListener('keydown', keyDownListen);
      div.addEventListener('blur', changeListen);
      div.setAttribute('data-idx', String(ind));

      if (attach.isMedia === false) {
        div.contentEditable = 'true';
        const txt = document.createElement('p');
        div.setAttribute('path', attach.file_path);
        txt.textContent = attach.data;
        div.appendChild(txt);
        attachesEl.appendChild(div);
        return;
      }

      if (checkImgExtension(attach.file_path)){
        const image = new Image();
        image.classList.add('post-image');
        image.src = atob(attach.data);

        const file = new Blob([atob(attach.data)], {type:"application/octet-stream"})
        pinned.size += file.size;

        const deleteBtn = createDeleteBtn(div, attach, pinned, false);

        div.appendChild(image);
        div.appendChild(deleteBtn);
        attachesEl.appendChild(div);
        return;
      }
      if (attach.file_path.endsWith(".mp4")){
        const video = document.createElement('video');
        video.height = 100;
        video.src = atob(attach.data);
        video.controls = true;

        const file = new Blob([atob(attach.data)], {type:"application/octet-stream"})
        pinned.size += file.size;

        const deleteBtn = createDeleteBtn(div, attach, pinned, false);

        div.appendChild(deleteBtn);
        div.appendChild(video);
        attachesEl.appendChild(div);
        return;
      }
      if (attach.file_path.endsWith(".mp3")){
        const audio = document.createElement('audio');
        audio.src = atob(attach.data);
        audio.controls = true;

        const file = new Blob([atob(attach.data)], {type:"application/octet-stream"})
        pinned.size += file.size;

        const deleteBtn = createDeleteBtn(div, attach, pinned, false);

        div.appendChild(deleteBtn);
        div.appendChild(audio);
        attachesEl.appendChild(div);
        return;
      }
      if (attach){
        const doc = document.createElement('a');
        doc.target = "_blank";
        doc.text += attach.name;
        // const file = new Blob([atob(attach.data)], {type:"application/octet-stream"})
        // // doc.href = URL.createObjectURL(file);
        const file = atob(attach.data);
        const arr = new Uint8Array(file.length);
        for (var i = 0; i < file.length; i++){
          arr[i] = file.charCodeAt(i);
        }
        doc.href = URL.createObjectURL(new Blob([arr], {type:"application/octet-stream"}));
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
  const id = currUrl.replace('editpost', '');
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = postEdit({ new: false, sub_levels: window.sub_levels });
  const backElement = document.getElementById(BACK_ELEMENT_ID);
  const headerEl = document.getElementById(THEME_INPUT_ID);
  const bodyEl = document.getElementById(TEXT_INPUT_ID);

  backElement.addEventListener('click', () => {
    window.history.back();
    return;
  });

  [headerEl].forEach((changableEl) => changableEl.addEventListener('input', () => {
    const level = document.querySelector('input:checked').id[0];
    //const newData = { post: { header: headerEl.value, body: bodyEl.value, level } };
    window.history.replaceState(newData, null, window.location.pathname);
  }));

  const levelChangeEl = document.querySelectorAll('.post-edit__sub-params-available-sub');

  levelChangeEl.forEach((levelChange) => levelChange.addEventListener('click', () => {
    const level = document.querySelector('input:checked').id[0];
    const newData = { post: { header: headerEl.value, body: bodyEl.value, level } };
    window.history.replaceState(newData, null, window.location.pathname);
  }));

  if (window.post !== undefined) {
    headerEl.value = window.post.header.trim();
    //bodyEl.value = window.post.body.trim();
    const subEl = document.getElementById(`${window.post.level}level`);
    subEl.checked = true;
    pattaches = window.post.attaches;
    renderAttaches(window.post.attaches, pinned);
    const newData = { post: {
      header: headerEl.value,
    //  body: bodyEl.value,
      level: window.post.level,
      attaches: window.post.attaches,
    } };
    window.history.replaceState(newData, null, window.location.pathname);
    delete window.post;
  } else if (window.history.state.post !== undefined) {
    const lastEditedPost = window.history.state.post;
    headerEl.value = lastEditedPost.header;
   // bodyEl.value = lastEditedPost.body;
    const subEl = document.getElementById(`${lastEditedPost.level}level`);
    subEl.checked = true;
    renderAttaches(lastEditedPost.attaches, pinned);
    // tagEl.valueOf = lastEditedPost.tags
  }

  const attachesEl = document.querySelector(".post-edit__attaches");
  const uploadImgButton = document.getElementById("upload-img");

  uploadImgButton.addEventListener("change", (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener("load", () => {
        const div = document.createElement('div');
        div.classList.add('post-edit__attaches__attach');

        const upImage = reader.result;
        const image = new Image();
        image.height = 100;
        image.title = file.name;
        image.src = upImage;

        const attach = {
          data: btoa(upImage),
          name: file.name,
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

  const uploadVideoButton = document.getElementById("upload-video");

  uploadVideoButton.addEventListener("change", (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener("load", () => {
        const div = document.createElement('div');
        div.classList.add('post-edit__attaches__attach');

        const upVideo = reader.result;
        const video = document.createElement("video");
        video.height = 100;
        video.title = file.name;
        video.src = upVideo;
        video.controls = true;

        const attach = {
          data: btoa(upVideo),
          name: file.name,
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

  const uploadAudioButton = document.getElementById("upload-audio");

  uploadAudioButton.addEventListener("change", (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener("load", () => {
        const div = document.createElement('div');
        div.classList.add('post-edit__attaches__attach');

        const upAudio = reader.result;
        const audio = document.createElement("audio");
        audio.title = file.name;
        audio.src = upAudio;
        audio.controls = true;

        const attach = {
          data: btoa(upAudio),
          name: file.name,
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

  const uploadFileButton = document.getElementById("upload-file");

  uploadFileButton.addEventListener("change", (e) => {
    let isError = false;
    Array.prototype.forEach.call(e.target.files, (file) => {
      const reader = new FileReader();
      const errorElement = document.querySelector(PARAMS_ERROR_CLASS);
      reader.addEventListener("load", () => {
        const div = document.createElement('div');
        div.classList.add('post-edit__attaches__attach');

        const upFile = reader.result;
        const doc = document.createElement("a");
        doc.title = file.name;
        doc.text += file.name;
        doc.target = "_blank";
        // doc.href = URL.createObjectURL(new Blob([upFile], {type:"application/octet-stream"}));
        const arr = new Uint8Array(upFile.length);
        for (var i = 0; i < upFile.length; i++){
          arr[i] = upFile.charCodeAt(i);
        }
        doc.href = URL.createObjectURL(new Blob([arr], {type:"application/octet-stream"}));
        doc.addEventListener('click', (e) => {
          e.preventDefault();
          const aEl = document.createElement('a');
          aEl.setAttribute("download", file.name);
          const href = e.target.href;
          aEl.href = href;
          aEl.setAttribute('target', '_blank');
          aEl.click();
          URL.revokeObjectURL(href);
        });

        const attach = {
          data: btoa(upFile),
          name: file.name,
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

  backElement.addEventListener('click', () => {
    window.router.redirect(`profile${window.user.id}`);
  });

  const verifyButton = document.getElementById(PUBLISH_ELEMENT_ID);
  verifyButton.addEventListener('click', () => {
    const header = headerEl.value;
    const body = '';
    const postTags = null;
    const min_subscription_level_id = Number(document.querySelector('input:checked').value);
    if (header === '') {
      const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
      errorEl.textContent = 'Тема или текст поста не могут быть пустыми';
    } else {
      pinned.files = pinned.files.filter(i => i !== undefined && i !==null);
      console.log(pinned);
      api.editPost({
        header, min_subscription_level_id, body, postTags, id, pinned
      });
      delete window.post;
      window.router.redirect(`profile${window.user.id}`);
    }
  });
};
