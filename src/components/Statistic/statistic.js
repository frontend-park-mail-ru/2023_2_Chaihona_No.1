import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '@configs/common_config.js';
import profileIcon from '@static/icons/Account.svg';
import shareIcon from '@static/icons/share.svg'
import commentIcon from '@static/icons/comment.svg';
import likeIcon from '@static/icons/like.svg';

import statistic from '@components/Statistic/statistic.handlebars';

import css from './statistic.scss';

export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';
  const api = new Api();
  const statisticRequest = await api.analytics();
  const stat = statisticRequest.data.body;
  rootElement.innerHTML = statistic(stat);
  const accIconBlocks = document.querySelectorAll('.statistics__block_subs');
  accIconBlocks.forEach((accIconBlock) => {
      accIconBlock.children[0].src = profileIcon;
  })
  document.querySelectorAll('.post-img').forEach((icon) => {
    icon.src = shareIcon;
  })
  document.querySelectorAll('.like-img').forEach((icon) => {
    icon.src = likeIcon;
  })
  document.querySelectorAll('.comment-img').forEach((icon) => {
    icon.src = commentIcon;
  })
  // if (statisticRequest.status >= MIN_FAIL_RESPONSE) {
  //   window.router.redirect(NOT_FOUND_URL);
  // }
}
