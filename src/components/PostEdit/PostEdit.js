import {PROFILE_URL, ROOT_ELEMENT_ID} from "@configs/common_config.js";
import postEdit from '@components/PostEdit/PostEdit.handlebars';

import css from '@components/PostEdit/PostEdit.css';
import {Api} from "@modules/api";

export default async () => {
    const api = new Api();
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = postEdit({new: false, sub_levels: window.sub_levels});
    const backElement = document.getElementById('back');

    const currUrl = window.location.href.split('/').pop();
    const id = currUrl.replace('postedit', '');

    backElement.addEventListener('click', () => {
        window.history.back();
    })

    const verifyButton = document.getElementById('publish');
    verifyButton.addEventListener('click', () => {
        const header = document.getElementById('theme').value;
        const body = document.getElementById('text').value;
        const postTags = document.getElementById('tags').value;
        const min_subscription_level_id = Number(document.querySelector('input:checked').value);
        api.editPost({header, min_subscription_level_id, body, postTags, id});
        window.history.back();
    });
}