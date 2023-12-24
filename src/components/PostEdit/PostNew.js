import { ROOT_ELEMENT_ID } from "@configs/common_config.js";
import postEdit from "@components/PostEdit/PostEdit.handlebars";

import css from "@components/PostEdit/PostEdit.scss";
import { Api } from "@modules/api";

const BACK_ELEMENT_ID = "back";
const PUBLISH_ELEMENT_ID = "publish";
const THEME_INPUT_ID = "theme";
const TEXT_INPUT_ID = "text";

const PARAMS_ERROR_CLASS = ".post-edit__params-error";
const SUB_ERROR_CLASS = ".post-edit__sub-params-error";

const videoExtRegExp = /(mp4)$/;
const audioExtRegExp = /(mp3)$/;
const imgExtRegExp = /(jp(e)?g|png)$/;


let pinned = [];
let pinnedSize = 0;

function checkImgExtension(imgName) {
  const re = new RegExp(imgExtRegExp);
  return re.test(imgName);
}

function checkVideoExtension(videoName) {
  const re = new RegExp(videoExtRegExp);
  return re.test(videoName);
}

function checkAudioExtension(audioName) {
  const re = new RegExp(audioExtRegExp);
  return re.test(audioName);
}

function validateZalgo(s) {
  return /[^\u+0300-\u+036F]/.test(s);
}

function keyDownListen(event) {
  const postDescription = document.querySelector('.post-edit__params-description');
  if (event.keyCode === 13) {
    let idx = Number(event.target.getAttribute('data-idx'));
    while ((idx+1 < postDescription.children.length)) {
      if ((pinned[idx+1])) {
        if ((pinned[idx+1].isMedia)) {
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
    let focus = idx+1;
    if (idx === postDescription.children.length - 1) {
      postDescription.appendChild(newPostBlock);
      pinned.push({
        data: newPostBlock.textContent,
        name: 'text',
        isMedia: false,
      });
    } else {
      postDescription.insertBefore(newPostBlock, postDescription.children[idx+1]);
      pinned.splice(idx+1, 0, {
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
      pinned[idx] = undefined;
      event.preventDefault();
      event.target.remove();
      idx = idx-1;
      while (pinned[idx] === undefined) {
        idx = idx - 1;
      }
      const abc = postDescription.children.item(idx);
      abc.focus();
      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    }
  }
}

function changeListen (event) {
  const idx = Number(event.target.getAttribute('data-idx'));
  if (pinned[idx]) {
    pinned[idx].data = event.target.children[0].textContent;
  }
}




export default async () => {
  pinned = [];
  const api = new Api();

  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = postEdit({
    new: true,
    sub_levels: window.sub_levels,
    isEdit: false,
  });
  const postBlocks = document.querySelectorAll('.post-block');
  const postDescription = document.querySelector('.post-edit__params-description');

  postBlocks.forEach(postBlock => {
    postBlock.setAttribute('data-idx', String(pinned.length));
    pinned.push({
      data: postBlock.children[0].textContent,
      name: 'text',
      isMedia: false,
    });
    postBlock.addEventListener('keydown', keyDownListen);
    postBlock.addEventListener('blur', changeListen);
  });


  const backElement = document.getElementById(BACK_ELEMENT_ID);
  const headerEl = document.getElementById(THEME_INPUT_ID);
  //const bodyEl = document.getElementById(TEXT_INPUT_ID);

  backElement.addEventListener("click", () => {
    window.history.back();
  });

  if (
    window.history.state !== null &&
    window.history.state.post !== undefined
  ) {
    const lastEditedPost = window.history.state.post;
    headerEl.value = lastEditedPost.header;
    //bodyEl.value = lastEditedPost.body;
    if (lastEditedPost.level) {
      const subEl = document.getElementById(`${lastEditedPost.level}level`);
      subEl.checked = true;
    }
  }

  [headerEl].forEach((changableEl) =>
    changableEl.addEventListener("input", () => {
      const levelEl = document.querySelector("input:checked");
      let level = null;
      if (levelEl) {
        level = levelEl.id[0];
      }
      const newData = {
        post: { header: headerEl.value, body: '', level },
      };
      window.history.replaceState(newData, null, window.location.pathname);
    }),
  );

  const levelChangeEl = document.querySelectorAll(
    ".post-edit__sub-params-available-sub",
  );

  levelChangeEl.forEach((levelChange) =>
    levelChange.addEventListener("click", () => {
      const levelEl = document.querySelector("input:checked");
      let level = null;
      if (levelEl) {
        level = levelEl.id[0];
      }
      const newData = {
        post: { header: headerEl.value, body: '', level },
      };
      window.history.replaceState(newData, null, window.location.pathname);
    }),
  );
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
        image.classList.add('post-image');
        image.title = file.name;
        image.src = upImage;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('post-edit__attaches__attach__delete-btn');
        deleteBtn.id = 'delete-btn-' + pinned.length;
        deleteBtn.name = pinned.length;
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', (e) => {
          div.parentNode.removeChild(div);
          pinnedSize -= file.size;
          delete pinned[Number(e.target.name)];
        });

        div.appendChild(image);
        div.appendChild(deleteBtn);
        const newPostBlock = document.createElement("div");
        newPostBlock.appendChild(div);
        newPostBlock.classList.add('post-block');
        //newPostBlock.contentEditable = 'true';
        newPostBlock.addEventListener('keydown', keyDownListen);
        postDescription.appendChild(newPostBlock);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.push({
          data: btoa(upImage),
          name: file.name,
          isMedia: true,
        });
        pinnedSize += file.size;
      });
      if (file && file.name) {
        if (!checkImgExtension(file.name)) {
          errorElement.textContent = 'Картинка должна быть в разрешении jp(e)g или png';
          file = null;
          isError = true;
          return;
        }
        if (pinnedSize + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.length >= 10) {
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
        video.classList.add('post-image');
        video.title = file.name;
        video.src = upVideo;
        video.controls = true;

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('post-edit__attaches__attach__delete-btn');
        deleteBtn.id = 'delete-btn-' + pinned.length;
        deleteBtn.name = pinned.length;
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', (e) => {
          div.parentNode.removeChild(div);
          pinnedSize -= file.size;
          delete pinned[Number(e.target.name)];
        });

        div.appendChild(video);
        div.appendChild(deleteBtn);
        const newPostBlock = document.createElement("div");
        newPostBlock.appendChild(div);
        newPostBlock.classList.add('post-block');
        //newPostBlock.contentEditable = 'true';
        newPostBlock.addEventListener('keydown', keyDownListen);
        postDescription.appendChild(newPostBlock);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.push({
          data: btoa(upVideo),
          name: file.name,
          isMedia: true,
        });
        pinnedSize += file.size;
      });
      if (file && file.name) {
        if (!checkVideoExtension(file.name)) {
          errorElement.textContent = 'Видео должно быть в разрешении mp4';
          file = null;
          isError = true;
          return;
        }
        if (pinnedSize + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.length >= 10) {
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

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('post-edit__attaches__attach__delete-btn');
        deleteBtn.id = 'delete-btn-' + pinned.length;
        deleteBtn.name = pinned.length;
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', (e) => {
          div.parentNode.removeChild(div);
          pinnedSize -= file.size;
          delete pinned[Number(e.target.name)];
        });

        div.appendChild(deleteBtn);
        div.appendChild(audio);
        const newPostBlock = document.createElement("div");
        newPostBlock.appendChild(div);
        newPostBlock.classList.add('post-block');
        //newPostBlock.contentEditable = 'true';
        newPostBlock.addEventListener('keydown', keyDownListen);
        postDescription.appendChild(newPostBlock);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.push({
          data: btoa(upAudio),
          name: file.name,
          isMedia: true,
        });
        pinnedSize += file.size;
      });
      if (file && file.name) {
        if (!checkAudioExtension(file.name)) {
          errorElement.textContent = 'Аудио должна быть в разрешении mp3';
          file = null;
          isError = true;
          return;
        }
        if (pinnedSize + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.length >= 10) {
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
        // doc.setAttribute("download", file.name);
        // doc.href = URL.createObjectURL(new Blob([upFile], {type:"application/octet-stream"}));
        // doc.href = URL.createObjectURL(new Blob([upFile]));
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

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('post-edit__attaches__attach__delete-btn');
        deleteBtn.id = 'delete-btn-' + pinned.length;
        deleteBtn.name = pinned.length;
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', (e) => {
          div.parentNode.removeChild(div);
          pinnedSize -= file.size;
          delete pinned[Number(e.target.name)];
        });


        let idx = Number(event.target.getAttribute('data-idx'));
        div.appendChild(deleteBtn);
        div.appendChild(doc);
        const newPostBlock = document.createElement("div");
        newPostBlock.appendChild(div);
        newPostBlock.classList.add('post-block');
        //newPostBlock.contentEditable = 'true';
        newPostBlock.addEventListener('keydown', keyDownListen);
        postDescription.appendChild(newPostBlock);
        if (!isError) {
          errorElement.textContent = '';
        }
        pinned.push({
          data: btoa(upFile),
          name: file.name,
          isMedia: true,
        });
        pinnedSize += file.size;
      });
      if (file && file.name) {
        if (pinnedSize + file.size > 104857600) {
          errorElement.textContent = 'Общий размер прикрепляемых файлов не должен превышать 100 МБ';
          file = null;
          isError = true;
          return;
        }
        if (pinned.length >= 10) {
          errorElement.textContent = 'Нельзя прикрепить больше 10 вложений';
          file = null;
          isError = true;
          return;
        }
        // reader.readAsBinaryString(file);

        // reader.readAsArrayBuffer(file);

        reader.readAsBinaryString(file);
      }
    });
    e.target.value = '';
  });

  const verifyButton = document.getElementById(PUBLISH_ELEMENT_ID);
  verifyButton.addEventListener("click", async () => {
    const header = headerEl.value;
    const body = '';
    const checked = document.querySelector("input:checked");
    if (pinned.length === 0 || header === "") {
      const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
      errorEl.textContent = "Заголовок или текст поста не могут быть пустыми";
    } else if (checked === null) {
      const errorEl = document.querySelector(SUB_ERROR_CLASS);
      errorEl.textContent = "Выберите уровень доступа";
    } else {
      const min_subscription_level_id = Number(checked.value);
      const attaches = pinned.filter(i => i !== undefined && i !==null);
      const postTagsEl = document.getElementById('tags');
      const postTags = postTagsEl.value.split(' ').filter((el) => el !== '').map((el) => {
        return {name: el};
      });

      const isNorm = attaches.every((attach) => {
        return attach.isMedia || !validateZalgo(attach.data);
      });
      if (!isNorm) {
        const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
        errorEl.textContent = "Некорректные данные";
        return
      }

      //const  attaches = null;
      const createRequest = await api.newPost({
        header,
        min_subscription_level_id,
        body,
        tags: postTags,
        attaches,
      });
      if (createRequest.status >= 400) {
        const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
        if (createRequest.status === 521) {
          errorEl.textContent = 'Ошибка: нет подключения к Интернету!';
          return;
        }
        errorEl.textContent = "Произошла ошибка при создании поста, попробуйте позже";
        return;
      }
      window.history.back();
    }
  });
};
