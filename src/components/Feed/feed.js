import './feed.scss';

import feed from '@components/Feed/feed.handlebars';
import post from '@components/Post/post.js';
import { Api } from '@modules/api.js';

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
  const ava = await api.getAvatar(window.user.id);
  post(false, ava, true);
};
