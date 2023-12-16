import css from '@components/Comment/comment.scss';

export default async () => {
  const comments = document.querySelectorAll('.comment-ava');
  comments.forEach( async (element) => {
    const userId = element.dataset.user;
    const userAva = await api.getAvatar(userId);
    element.src = userAva;
    element.addEventListener('click', () => {
      window.router.redirect(`profile${userId}`);
      return;
    });
  });

};