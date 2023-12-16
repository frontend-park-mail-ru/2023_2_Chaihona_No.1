import css from '@components/Comment/comment.scss';
import { Api } from '@modules/api';
import commentOptionsIcon from '@static/icons/post_opts.svg';

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

  const commentSettingsButton = document.querySelectorAll('.comment__options-button');
  commentSettingsButton.forEach((btn) => btn.src = commentOptionsIcon);
  commentSettingsButton.forEach((btn) => {
    btn.addEventListener('click' ,(e) => {
      const id = e.target.dataset.comment;
      const commentMenu = document.getElementById('comment-submenu-'+id);
      if (commentMenu.style.display === 'none') {
        commentMenu.style.display = 'flex';
      } else {
        commentMenu.style.display = 'none';
      }

      const commentDeleteButton = commentMenu.children[0];

      commentDeleteButton.addEventListener('click', async () => {
        const api = new Api();
        await api.deleteComment(id);
        const comment = commentMenu.parentNode.parentNode;
        comment.remove();
      });
    });
  });
};