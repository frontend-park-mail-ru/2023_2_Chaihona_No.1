import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '@configs/common_config.js';

import survey from '@components/Survey/survey.handlebars';

import css from './survey.scss';

export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';
  if (window.user === undefined) {
    return window.router.redirect('login');
  }
  const navbarElement = document.querySelector(NAVBAR_ELEMENT_ID);
  navbarElement.parentNode.removeChild(navbarElement);
  // const api = new Api();
  // const questionsRequest = await api.getQuestions(id);

  // if (questionsRequest.status >= MIN_FAIL_RESPONSE) {
  //   window.router.redirect(NOT_FOUND_URL);
  // }

  // const { questions } = questionsRequest.data.body;
  // if (questions.questions === undefined || questions.questions === null) {
  //   return window.router.redirect('nenahod');
  // }
  rootElement.innerHTML = survey();
};