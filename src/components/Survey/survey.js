import { Api } from '@modules/api.js';
import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
} from '@configs/common_config.js';

import survey from '@components/Survey/survey.handlebars';

import css from './survey.scss';
import { Input } from 'postcss';

export default async () => {
  const rootElement = document.querySelector('#root');
  rootElement.innerHTML = '';
  if (window.user === undefined) {
    return window.router.redirect('login');
  }
  const navbarElement = document.querySelector("#navbar");
  navbarElement.parentNode.removeChild(navbarElement);
  const api = new Api();
  const questionsRequest = await api.getQuestions(window.user.id);

  if (questionsRequest.status >= MIN_FAIL_RESPONSE) {
    window.router.redirect(NOT_FOUND_URL);
  }

  const questions = questionsRequest.data.body;
  // if (questions.questions === undefined || questions.questions === null) {
  //   return window.router.redirect('nenahod');
  // }
  rootElement.innerHTML = survey();
  const iterator = questions.questions[Symbol.iterator]();
  let next = iterator.next();
  console.log(questions);
  console.log(questions.length);
  if (questions.length > 0) {
  }
  renderForm(next);

  const submitBtn = document.querySelector(".survey__submit-button");
  submitBtn.addEventListener('click', async () => {
    const checked = document.querySelector('input:checked');
    if (checked === null) {
      const errorEl = document.querySelector(".survey__marks-error");
      errorEl.textContent = "Выберите оценку";
      return
    }
    const rating = Number(checked.value);
    const rateRequest = await api.rate(next.value.id, rating);
    next = iterator.next();
    renderForm(next);
  })
};

const renderForm = (next) => {
  if (next.done) {
    const marks = document.querySelector('.survey__marks');
    marks.innerHTML = "";

    const submitBtn = document.querySelector(".survey__submit-button");
    submitBtn.parentNode.removeChild(submitBtn);
    marks.textContent = "Спасибо, что ответили на все наши вопросы!";
    return;
  }
  let question = next.value;
  //if 5 stars
  console.log(question.question_type);
  if (question.question_type == 0) {
    const text = document.querySelector(".survey__question__text");
    text.textContent = question.question;

    const marks = document.querySelector('.survey__marks');
    marks.innerHTML = "";
    for (let i = 1; i < 6; i++) {
      const newDiv = document.createElement("div");
      newDiv.classList.add("survey__marks__mark");

      const newInput = document.createElement("input");
      newInput.type = "radio";
      newInput.id = "mark_" + i;
      newInput.value = i;
      newInput.name = "mark_variant";
      const newLabel = document.createElement("label");
      newLabel.htmlFor = newInput.id;

      newDiv.appendChild(newInput);
      newDiv.appendChild(newLabel);

      marks.appendChild(newDiv);
    }
  }
}