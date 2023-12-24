import css from '@components/Comment/comment.scss';
import { Api } from '@modules/api';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
  ROOT_ELEMENT_ID,
  MOUSE_CLICK_EVENT,
  NEWPOST_URL,
} from '@configs/common_config.js';
import commentOptionsIcon from '@static/icons/post_opts.svg';

const COMMENT_AVA_CLASS = '.comment-ava';
const COMMENT_OPTIONS_BTN = '.comment__options-button';

const COMMENT_SUBMENU_ID = 'comment-submenu-';

const STYLE_FLEX = 'flex';
const STYLE_NONE = 'none';

export default async () => {
  const comments = document.querySelectorAll(COMMENT_AVA_CLASS);
  comments.forEach( async (element) => {
    const api = new Api();
    const userId = element.dataset.user;
    const userAva = await api.getAvatar(userId);
    element.src = userAva;
    element.addEventListener(MOUSE_CLICK_EVENT, () => {
      window.router.redirect(`profile${userId}`);
      return;
    });
  });

  const commentSettingsButton = document.querySelectorAll(COMMENT_OPTIONS_BTN);
  commentSettingsButton.forEach((btn) => btn.src = commentOptionsIcon);
  commentSettingsButton.forEach((btn) => {
    btn.addEventListener(MOUSE_CLICK_EVENT ,(e) => {
      const id = e.target.dataset.comment;
      const commentMenu = document.getElementById(COMMENT_SUBMENU_ID+id);
      if (commentMenu.style.display === STYLE_NONE) {
        commentMenu.style.display = STYLE_FLEX;
      } else {
        commentMenu.style.display = STYLE_NONE;
      }

      const commentDeleteButton = commentMenu.children[0];

      commentDeleteButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
        const api = new Api();
        await api.deleteComment(id);
        const comment = commentMenu.parentNode.parentNode;
        comment.remove();
      });
    });
  });
};