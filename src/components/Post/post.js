import { Api } from '@modules/api';

import postOptionsIcon from '@static/icons/post_opts.svg';
// import likeIcon from '@static/icons/like.svg';
import likedImg from '@static/icons/liked.png';
import unlikedImg from '@static/icons/favourite.png';
import commentIcon from '@static/icons/comment.svg';
import shareIcon from '@static/icons/share.svg';
import sendIcon from '@static/icons/send.svg';

import { comment } from 'postcss';
import CommentHB from '@components/Comment/comment.handlebars';
import commentJS from '@components/Comment/comment.js';
import { isAwaitKeyword } from 'typescript';

const SUBMENU_ID = 'submenu';
const HEADER_ID = 'header';
const BODY_ID = 'body';
const SUB_LEVEL_ID = 'sub-level';

const COMMENT_ICON_CLASS = '.post__like-comments-share_comments-icon';
const SHARE_ICON_CLASS = '.post__like-comments-share_share-icon';
const POST_SETTINGS_ICON_CLASS = '.post__options-button';
const CLICKED_LIKE_CLASS = 'post__like-comments-share-like_clicked';
const LIKE_ICON_CLASS = '.post__like-comments-share_like';
const SEND_ICON_CLASS = '.post__comment-input-send-button';
const INPUT_AVA_IMG_CLASS = '.post__comment-input-ava';

export default (isOwner, userAva, posts, isFeed=false) => {
  const sendButtons = document.querySelectorAll(SEND_ICON_CLASS);
  sendButtons.forEach((sendButton) => sendButton.src = sendIcon);

  var isAuthorized = false;
  if (window.user !== undefined) {
    isAuthorized = true;
  }

  sendButtons.forEach((sendButton) => sendButton.addEventListener('click', async (event) => {
    if (isAuthorized) {
      const text = document.querySelector('#comment-field-' + sendButton.dataset.post).value;
      const api = new Api();
      const commentErrText = document.querySelector('#comment-error-text-' + sendButton.dataset.post);
      if (text.length === 0) {
        commentErrText.style.display = 'flex';
        commentErrText.textContent = "Комментарий не может быть пустым";
        return;
      }
      const commentRequest = await api.createComment(text, sendButton.dataset.post);
      if (commentRequest.status >= 400 || commentRequest.data.body === undefined) {
        commentErrText.style.display = 'flex';
        commentErrText.textContent = "Не удалось отправить комментарий";
        return;
      }
      commentErrText.textContent = '';
      commentErrText.style.display = 'none';
      document.querySelector('#comment-field-' + sendButton.dataset.post).value = "";
      const commentList = document.querySelector('#post-comment-list-' + sendButton.dataset.post);
      commentList.innerHTML += CommentHB({
        user_id: window.user.id,
        is_owner: true,
        id: commentRequest.data.body.id,
        text: text,
        ava: userAva,
        editBtn: postOptionsIcon,
      });
      const commentEditBtn = document.querySelector('#comment-options-button-'+commentRequest.data.body.id);
      commentEditBtn.addEventListener('click' ,(e) => {
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

        const commentAvaEl = document.querySelector('#comment-ava-' + +commentRequest.data.body.id);
        commentAvaEl.addEventListener('click', () => {
          window.router.redirect(`profile${window.user.id}`);
          return
        })
      });
    } else {
      return window.router.redirect('login');
    }
    // alert('Комментарии будут на РК4');
  }));



  if (isOwner) {
    const postSettingsButton = document.querySelectorAll(POST_SETTINGS_ICON_CLASS);
    postSettingsButton.forEach((settingsButton) => settingsButton.src = postOptionsIcon);

    postSettingsButton.forEach((settingsButton) => settingsButton.addEventListener('click', (event) => {
      const id = event.target.dataset.post;
      const postMenu = document.getElementById(`${SUBMENU_ID}-${id}`);
      if (postMenu.style.display === 'none') {
        postMenu.style.display = 'flex';
      } else {
        postMenu.style.display = 'none';
      }

      const postEditButton = postMenu.children[0];
      const postDeleteButton = postMenu.children[1];

      postEditButton.addEventListener('click', () => {
        const post = {};
        post.header = document.getElementById(`${HEADER_ID}-${id}`).textContent;
        post.body = document.getElementById(`${BODY_ID}-${id}`).textContent;
        post.level = document.getElementById(`${SUB_LEVEL_ID}-${id}`).textContent;
		    post.tags = [];
        const curPost = posts.find(p => p.id === Number(id));
        if (curPost !== undefined && curPost !== null) {
          post.attaches = curPost.attaches;
        }
        window.post = post;
        return window.router.redirect(`/editpost${id}`);
      });

      postDeleteButton.addEventListener('click', async () => {
        const api = new Api();
        await api.deletePost(id);
        const post = postMenu.parentNode.parentNode.parentNode;
        post.remove();
      });
    }));
  }
  document.querySelectorAll(COMMENT_ICON_CLASS).forEach((commentButton) => commentButton.src = commentIcon);
  document.querySelectorAll(SHARE_ICON_CLASS).forEach((shareButton) => shareButton.src = shareIcon);

  // document.querySelectorAll('.comment-ava-img').forEach((commentAva) => commentAva.src = userAva);
  document.querySelectorAll(INPUT_AVA_IMG_CLASS).forEach((inputAva) => inputAva.children[0].src = userAva);
  if (isFeed) {
    const auhtorAvaEl = document.querySelectorAll('.post__date-input-ava');
    auhtorAvaEl.forEach(async (creatorAva) => {
      creatorAva.style.display = 'flex';
      const api = new Api();
      const authorAva = await api.getAvatar(Number(creatorAva.dataset.author));
      creatorAva.children[0].src = authorAva;
      creatorAva.addEventListener('click', () => {
        window.router.redirect(`profile${creatorAva.dataset.author}`);
        return;
      });
    });
  }


  const postLikeButton = document.querySelectorAll(LIKE_ICON_CLASS);
  postLikeButton.forEach((likeButton) => {
    if (likeButton.dataset.liked) {
      likeButton.src = likedImg;
    } else {
      likeButton.src = unlikedImg;
    }
  });

  postLikeButton.forEach((likeButton) => likeButton.addEventListener('click', async (event) => {
    const id = event.target.dataset.post;
    const { liked } = event.target.dataset;
    const lks = document.getElementById(`like-${id}`);
    const likesCount = document.getElementById(`likes-${id}`);
    if (liked === 'true') {
      const api = new Api();
      await api.unlikePost(id);
      lks.classList.remove(CLICKED_LIKE_CLASS);
      likesCount.textContent = String(Number(likesCount.textContent) - 1);
      event.target.dataset.liked = false;
      event.target.src = unlikedImg;
    } else {
      const api = new Api();
      await api.likePost(id);
      lks.classList.add(CLICKED_LIKE_CLASS);
      likesCount.textContent = String(Number(likesCount.textContent) + 1);
      event.target.dataset.liked = true;
      event.target.src = likedImg;
    }
  }));

  commentJS();
};
