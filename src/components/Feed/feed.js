import './feed.css'

import feed from '@components/Feed/feed.handlebars'
import {Api} from "@modules/api.js";

export default async () => {
    const rootElement = document.querySelector('#root');
    const api = new Api();
    const response = await api.getFeed();
    if (response.data.body.posts === null) {
        rootElement.textContent = 'У вас ещё нет подписок';
    }
    rootElement.innerHTML = feed(response.data.body);
}