import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '@configs/common_config.js';

import statistic from '@components/Statistic/statistic.handlebars';

import css from './statistic.scss';
import { Input } from 'postcss';

export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';
  const api = new Api();
  const statisticRequest = await api.getStatistic();
  if (statisticRequest.status >= MIN_FAIL_RESPONSE) {
    window.router.redirect(NOT_FOUND_URL);
  }

  const stat = statisticRequest.data.body;
  rootElement.innerHTML = statistic(stat);
}