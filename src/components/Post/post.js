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
import {
  MOUSE_CLICK_EVENT,
  LOGIN_URL,
  FEDD_URL,
 } from '@configs/common_config.js';

const SUBMENU_ID = 'submenu';
const HEADER_ID = 'header';
const BODY_ID = 'body';
const SUB_LEVEL_ID = 'sub-level';
const COMMENT_FIELD_ID = '#comment-field-';
const COMMENT_ERROR_TEXT_ID = '#comment-error-text-';
const POST_COMMENT_LIST_ID = '#post-comment-list-';
const COMMENT_OPTIONS_BTN_ID = '#comment-options-button-';
const COMMENT_SUBMENU_ID = 'comment-submenu-';
const COMMENT_AVA_ID = '#comment-ava-';

const COMMENT_ICON_CLASS = '.post__like-comments-share_comments-icon';
const SHARE_ICON_CLASS = '.post__like-comments-share_share-icon';
const POST_SETTINGS_ICON_CLASS = '.post__options-button';
const CLICKED_LIKE_CLASS = 'post__like-comments-share-like_clicked';
const LIKE_ICON_CLASS = '.post__like-comments-share_like';
const SEND_ICON_CLASS = '.post__comment-input-send-button';
const INPUT_AVA_IMG_CLASS = '.post__comment-input-ava';
const POST_DATE_INPUT_AVA_CLASS = '.post__date-input-ava';
const POST_TAGLINE_TAG_CLASS = '.post__tagline-tag';

const STYLE_NONE = 'none';
const STYLE_FLEX = 'flex';

const TRUE_STRING = 'true';

export default (isOwner, userAva, posts, isFeed=false) => {
  const sendButtons = document.querySelectorAll(SEND_ICON_CLASS);
  sendButtons.forEach((sendButton) => sendButton.src = sendIcon);

  var isAuthorized = false;
  if (window.user !== undefined) {
    isAuthorized = true;
  }

  sendButtons.forEach((sendButton) => sendButton.addEventListener(MOUSE_CLICK_EVENT, async (event) => {
    if (isAuthorized) {
      const text = document.querySelector(COMMENT_FIELD_ID + sendButton.dataset.post).value;
      const api = new Api();
      const commentErrText = document.querySelector(COMMENT_ERROR_TEXT_ID + sendButton.dataset.post);
      if (text.length === 0) {
        commentErrText.style.display = STYLE_FLEX;
        commentErrText.textContent = "Комментарий не может быть пустым";
        return;
      }
      const commentRequest = await api.createComment(text, sendButton.dataset.post);
      if (commentRequest.status >= 400 || commentRequest.data.body === undefined) {
        commentErrText.style.display = STYLE_FLEX;
        commentErrText.textContent = "Не удалось отправить комментарий";
        return;
      }
      commentErrText.textContent = '';
      commentErrText.style.display = STYLE_NONE;
      document.querySelector(COMMENT_FIELD_ID+ sendButton.dataset.post).value = "";
      const commentList = document.querySelector(POST_COMMENT_LIST_ID + sendButton.dataset.post);
      commentList.innerHTML += CommentHB({
        user_id: window.user.id,
        is_owner: true,
        id: commentRequest.data.body.id,
        text: text,
        ava: userAva,
        editBtn: postOptionsIcon,
      });
      const commentEditBtn = document.querySelector(COMMENT_OPTIONS_BTN_ID + commentRequest.data.body.id);
      commentEditBtn.addEventListener(MOUSE_CLICK_EVENT ,(e) => {
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

        const commentAvaEl = document.querySelector(COMMENT_AVA_ID +commentRequest.data.body.id);
        commentAvaEl.addEventListener(MOUSE_CLICK_EVENT, () => {
          window.router.redirect(`profile${window.user.id}`);
          return
        })
      });
    } else {
      return window.router.redirect(LOGIN_URL);
    }
    // alert('Комментарии будут на РК4');
  }));



  if (isOwner) {
    const postSettingsButton = document.querySelectorAll(POST_SETTINGS_ICON_CLASS);
    postSettingsButton.forEach((settingsButton) => settingsButton.src = postOptionsIcon);

    postSettingsButton.forEach((settingsButton) => settingsButton.addEventListener(MOUSE_CLICK_EVENT, (event) => {
      const id = event.target.dataset.post;
      const postMenu = document.getElementById(`${SUBMENU_ID}-${id}`);
      if (postMenu.style.display === STYLE_NONE) {
        postMenu.style.display = STYLE_FLEX;
      } else {
        postMenu.style.display = STYLE_NONE;
      }

      const postEditButton = postMenu.children[0];
      const postDeleteButton = postMenu.children[1];

      postEditButton.addEventListener(MOUSE_CLICK_EVENT, () => {
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

      postDeleteButton.addEventListener(MOUSE_CLICK_EVENT, async () => {
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
    const auhtorAvaEl = document.querySelectorAll(POST_DATE_INPUT_AVA_CLASS);
    auhtorAvaEl.forEach(async (creatorAva) => {
      creatorAva.style.display = STYLE_FLEX;
      const api = new Api();
      const authorAva = await api.getAvatar(Number(creatorAva.dataset.author));
      creatorAva.children[0].src = authorAva;
      creatorAva.addEventListener(MOUSE_CLICK_EVENT, () => {
        window.router.redirect(`profile${creatorAva.dataset.author}`);
        return;
      });
    });
  }


  const postLikeButton = document.querySelectorAll(LIKE_ICON_CLASS);
  postLikeButton.forEach((likeButton) => {
    if (likeButton.dataset.liked === TRUE_STRING) {
      likeButton.src = likedImg;
    } else {
      likeButton.src = unlikedImg;
    }
  });

  postLikeButton.forEach((likeButton) => likeButton.addEventListener(MOUSE_CLICK_EVENT, async (event) => {
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

  const tagsEl = document.querySelectorAll(POST_TAGLINE_TAG_CLASS);
  tagsEl.forEach((tagEl) => {
    tagEl.addEventListener(MOUSE_CLICK_EVENT, () => {
      window.router.redirect(FEDD_URL, null, tagEl.innerHTML);
    });
  });

  commentJS();
};
