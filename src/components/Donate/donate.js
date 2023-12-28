import { Api } from '@modules/api.js';

import {
  PROFILE_URL,
  MIN_FAIL_RESPONSE,
  NOT_FOUND_URL,
  ROOT_ELEMENT_ID,
  MOUSE_CLICK_EVENT,
  NEWPOST_URL,
} from '@configs/common_config.js';

import css from './donate.scss';

const DONATE_DIALOG_ID = 'donate-dialog';
const CLOSE_BUTTON_ID = '#close';
const SEND_DONATE_BUTTON_ID = '#send-donate';

const DONATE_SUM_INPUT_CLASS = '.donate-window__sum-input';
const ERROR_TEXT_CLASS = '.donate-window__error-text';

const ONLY_AVAILABLE_CURRENCY = 'RUB';
const MIN_SUM_ERROR_TEXT = 'Минимальная сумма - 10 RUB';

export default async (receiver) => {
  const dialog = document.getElementById(DONATE_DIALOG_ID);
  document.querySelector(CLOSE_BUTTON_ID)
    .addEventListener(MOUSE_CLICK_EVENT, () => {
      dialog.close();
    });
  document.querySelector(SEND_DONATE_BUTTON_ID).addEventListener(MOUSE_CLICK_EVENT, async () => {
    const sum = document.querySelector(DONATE_SUM_INPUT_CLASS).value;
    if (sum < 10) {
      const errEl = document.querySelector(ERROR_TEXT_CLASS);
      errEl.textContent = MIN_SUM_ERROR_TEXT;
    } else {
      const api = new Api();
      const response = await api.donate(window.user.id, receiver, ONLY_AVAILABLE_CURRENCY, sum);
      dialog.close();
      window.location.href = response.data.body.redirect_url;
    }
  });
};
