import css from '@components/Comment/comment.scss';
import { Api } from '@modules/api';

export default async () => {
  const comments = document.querySelectorAll('.comment-ava');
  comments.forEach( async (element) => {
    const api = new Api();
    const userId = element.dataset.user;
    const userAva = await api.getAvatar(userId);
    element.src = userAva;
    element.addEventListener('click', () => {
      window.router.redirect(`profile${userId}`);
      return;
    });
  });

};