import './feed.scss';

import feed from '@components/Feed/feed.handlebars';
import post from '@components/Post/post.js';
import { Api } from '@modules/api.js';

const imgExtRegExp = /(jp(e)?g|png)$/;


function checkImgExtension(imgName) {
  const re = new RegExp(imgExtRegExp);
  return re.test(imgName);
}

export default async () => {
  const rootElement = document.querySelector('#root');
  const api = new Api();
  const response = await api.getFeed();
  rootElement.innerHTML = feed(response.data.body);
  const emptyElement = document.querySelector('.feed__empty')
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
          const attachesEl = document.getElementById('attaches-'+profilePost.id);
          const currAttach = document.createElement('div');
          currAttach.classList.add('post-block');
          if (attachesEl === null || attachesEl === undefined) {
            return
          }
          if (attach.isMedia === false) {
            const txt = document.createElement('p');
            txt.textContent = attach.data;
            currAttach.appendChild(txt);
            attachesEl.appendChild(currAttach);
            return;
          }
          if (checkImgExtension(attach.file_path)){
            const image = document.createElement('img');
            image.src = atob(attach.data);
            image.classList.add("post__image-attach");
            image.classList.add('post-image');
            currAttach.appendChild(image);
            attachesEl.appendChild(currAttach);
            return;
          }
          if (attach.file_path.endsWith(".mp4")){
            const video = document.createElement('video');
            video.classList.add('post-image');
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
            const doc = document.createElement('button');
            doc.classList.add('file');
            doc.target = "_blank";
            const img = document.createElement('img');
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
          }
        });
      }
    });
  }

  const ava = await api.getAvatar(window.user.id);
  post(false, ava, true, true);
};
