import {ROOT_ELEMENT_ID} from "@configs/common_config.js";
import postEdit from "@components/PostEdit/PostEdit.handlebars";

import css from '@components/PostEdit/PostEdit.scss';
import {Api} from "@modules/api";

const BACK_ELEMENT_ID = 'back';
const PUBLISH_ELEMENT_ID = 'publish';
const THEME_INPUT_ID = 'theme';
const TEXT_INPUT_ID = 'text'

const PARAMS_ERROR_CLASS = '.post-edit__params-error';
const SUB_ERROR_CLASS = '.post-edit__sub-params-error';

export default async () => {
    const api = new Api();

    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = postEdit({new: true, sub_levels: window.sub_levels});
    const backElement = document.getElementById(BACK_ELEMENT_ID);

    backElement.addEventListener('click', () => {
        window.history.back();
    })

    const verifyButton = document.getElementById(PUBLISH_ELEMENT_ID);
    verifyButton.addEventListener('click', () => {
        const header = document.getElementById(THEME_INPUT_ID).value;
        const body = document.getElementById(TEXT_INPUT_ID).value;
        const postTags = null;
        const checked = document.querySelector('input:checked');
        if (body === '' || header === '') {
            const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
            errorEl.textContent = 'Тема или текст поста не могут быть пустыми';
        }
        else if (checked === null) {
            const errorEl = document.querySelector(SUB_ERROR_CLASS);
            errorEl.textContent = 'Выберите уровень доступа';
        } else {
            const min_subscription_level_id = Number(checked.value);
            api.newPost({header, min_subscription_level_id, body, postTags});
            window.history.back();
        }
    });
}
