import {PROFILE_URL, ROOT_ELEMENT_ID} from "@configs/common_config.js";
import postEdit from '@components/PostEdit/PostEdit.handlebars';

import css from '@components/PostEdit/PostEdit.css';
import {Api} from "@modules/api";

export default async () => {
    const api = new Api();
    const currUrl = window.location.href.split('/').pop();
    const id = currUrl.replace('editpost', '');
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = postEdit({new: false, sub_levels: window.sub_levels});
    const backElement = document.getElementById('back');
    const headerEl = document.getElementById('theme');
    const bodyEl = document.getElementById('text');
    //const tagEl = document.getElementById('tags');

    if (window.post !== undefined) {
        headerEl.value = window.post.header.trim();
        bodyEl.value = window.post.body.trim();
	const subEl = document.getElementById('0level');
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


    const verifyButton = document.getElementById('publish');
    verifyButton.addEventListener('click', () => {
        const header = headerEl.value;
        const body = bodyEl.value;
        const postTags = null;
        const min_subscription_level_id = Number(document.querySelector('input:checked').value);
        api.editPost({header, min_subscription_level_id, body, postTags, id});
        delete window.post;
        //const newData = { post: {header: headerEl.value, body: bodyEl.value, tags: tagEl.value}};
        //window.history.replaceState(newData, null);
        window.router.redirect('profile' + window.user.id);
    });
}
