import {PROFILE_URL, ROOT_ELEMENT_ID} from "@configs/common_config.js";
import postEdit from '@components/PostEdit/PostEdit.handlebars';

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
    const currUrl = window.location.href.split('/').pop();
    const id = currUrl.replace('editpost', '');
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = postEdit({new: false, sub_levels: window.sub_levels});
    const backElement = document.getElementById(BACK_ELEMENT_ID);
    const headerEl = document.getElementById(THEME_INPUT_ID);
    const bodyEl = document.getElementById(TEXT_INPUT_ID);
    //const tagEl = document.getElementById('tags');

    if (window.post !== undefined) {
        headerEl.value = window.post.header.trim();
        bodyEl.value = window.post.body.trim();
        const subEl = document.getElementById(window.post.level + 'level');
        subEl.checked = true;
    } else if (window.history.state.post !== undefined) {
        const lastEditedPost = window.history.state.getData().post;
        headerEl.value = lastEditedPost.header;
        bodyEl.value = lastEditedPost.body
        //tagEl.valueOf = lastEditedPost.tags
    }

    backElement.addEventListener('click', () => {
        window.router.redirect('profile' + window.user.id);
    })


    const verifyButton = document.getElementById(PUBLISH_ELEMENT_ID);
    verifyButton.addEventListener('click', () => {
        const header = headerEl.value;
        const body = bodyEl.value;
        const postTags = null;
        const min_subscription_level_id = Number(document.querySelector('input:checked').value);
        if (body === '' || header === '') {
            const errorEl = document.querySelector(PARAMS_ERROR_CLASS);
            errorEl.textContent = 'Тема или текст поста не могут быть пустыми';
        } else {
            api.editPost({header, min_subscription_level_id, body, postTags, id});
            delete window.post;
            //const newData = { post: {header: headerEl.value, body: bodyEl.value, tags: tagEl.value}};
            //window.history.replaceState(newData, null);
            window.router.redirect('profile' + window.user.id);
        }
    });
}
