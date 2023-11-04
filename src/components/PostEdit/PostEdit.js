import {PROFILE_URL, ROOT_ELEMENT_ID} from "@configs/common_config.js";
import postEdit from '@components/PostEdit/PostEdit.handlebars';

import css from '@components/PostEdit/PostEdit.css';

export default async () => {
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = postEdit({new: false});
    const backElement = document.getElementById('back');

    const currUrl = window.location.href.split('/').pop();
    const id = currUrl.replace('postedit', '');

    backElement.addEventListener('click', () => {
        window.history.back();
    })

    const verifyButton = document.getElementById('publish');
    verifyButton.addEventListener('click', () => {
        const postTheme = document.getElementById('theme').value;
        const postText = document.getElementById('text').value;
        const postTags = document.getElementById('tags').value;
        const postLevel = document.querySelector('input:checked').value;
        // alert(postTheme);
        // alert(postText);
        // alert(postTags);
        // alert(postLevel);
        alert(id);
    });

    const removeButton = document.getElementById('delete');
    removeButton.addEventListener('click', () => {
        alert(id);
    });
}