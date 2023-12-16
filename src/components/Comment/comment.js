import css from '@components/Comment/comment.scss';

export default async () => {
  const comments = document.querySelectorAll('.comment-ava');
  comments.array.forEach( async (element) => {
    const userId = element.dataset.user;
    const userAva = await api.getAvatar(userId);
    element.src = userAva;
    element.addEventListner('click', () => {
      window.router.redirect(`profile${userId}`);
      return;
    })
  });

};