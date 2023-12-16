import css from '@components/Comment/comment.scss';

export default async (comment) => {
  const comments = document.querySelectorAll('.comment-ava');
  comment.array.forEach( async (element) => {
    const userId = element.dataset.user;
    const userAva = await api.getAvatar(window.user.id);
    element.src = userAva;
  });
};