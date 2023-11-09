import {ROOT_ELEMENT_ID} from "@configs/common_config.js";
import postEdit from "@components/PostEdit/PostEdit.handlebars";

import css from '@components/PostEdit/PostEdit.css';
import {Api} from "@modules/api";

export default async () => {
    const api = new Api();

    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = postEdit({new: true, sub_levels: window.sub_levels});
    const backElement = document.getElementById('back');

    backElement.addEventListener('click', () => {
        window.history.back();
    })

    const verifyButton = document.getElementById('publish');
    verifyButton.addEventListener('click', () => {
        const header = document.getElementById('theme').value;
        const body = document.getElementById('text').value;
        const postTags = null;
        const checked = document.querySelector('input:checked');
	if (header === '' || body === '') {
		const errPost = document.querySelector('.errorPost');
		errPost.textContent = 'Заголовок и текст поста не могут быть пустыми';
	}    
	    else if (checked === null) {
            const errorEl = document.querySelector('.error')
            errorEl.textContent = 'Выберите уровень доступа';
        } else {
            const min_subscription_level_id = Number(checked.value);
            api.newPost({header, min_subscription_level_id, body, postTags});
            window.history.back();
        }
    });
}
