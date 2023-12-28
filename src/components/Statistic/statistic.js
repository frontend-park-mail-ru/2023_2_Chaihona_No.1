import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
  ROOT_ELEMENT_ID,
} from '@configs/common_config.js';
import profileIcon from '@static/icons/Account.svg';
import shareIcon from '@static/icons/share.svg'
import commentIcon from '@static/icons/comment.svg';
import likeIcon from '@static/icons/like.svg';

import statistic from '@components/Statistic/statistic.handlebars';

import css from './statistic.scss';

const BLOCK_SUBS_CLASS = '.statistics__block_subs';
const POST_IMG = '.post-img';
const LIKE_ING = '.like-img';
const COMMENT_IMG = '.comment-img';

export default async () => {
  const rootElement = document.querySelector(ROOT_ELEMENT_ID);
  rootElement.innerHTML = '';
  const api = new Api();
  const statisticRequest = await api.analytics();
  const stat = statisticRequest.data.body;
  rootElement.innerHTML = statistic(stat);
  const accIconBlocks = document.querySelectorAll(BLOCK_SUBS_CLASS);
  accIconBlocks.forEach((accIconBlock) => {
      accIconBlock.children[0].src = profileIcon;
  })
  document.querySelectorAll(POST_IMG).forEach((icon) => {
    icon.src = shareIcon;
  })
  document.querySelectorAll(LIKE_ING).forEach((icon) => {
    icon.src = likeIcon;
  })
  document.querySelectorAll(COMMENT_IMG).forEach((icon) => {
    icon.src = commentIcon;
  })
  // if (statisticRequest.status >= MIN_FAIL_RESPONSE) {
  //   window.router.redirect(NOT_FOUND_URL);
  // }
}
