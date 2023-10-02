import {Api} from "../../modules/api.js";

/**
 * Функция отрисовки страницы пользователя
 */
export default async () => {
    const rootElement = document.querySelector('#root');
    rootElement.innerHTML = '';
    const currUrl = window.location.href.split('/').pop();
    const id = currUrl.replace('profile', '');

    console.log('trying to get user w/id' + id);

    const api = new Api();
    const profileRequest = await api.getUserProfile(id);

    if (profileRequest.status >= 300) {
        alert('фронтендер отчислен =(');
    }

    const profile = profileRequest.data.body.profiles.user;
    if (profile.user_type === 'creator') {
        const postsRequest = await api.getUserPosts(id);
        if (postsRequest.status >= 300) {
            alert('фронтендер отчислен =(');
        }
        profile.posts = postsRequest.data.body.posts;
        console.log(profile.posts)
        // profile.targets.forEach(function (target) {
        //     target.doneproc = target.done/target.target*100;
        //     target.leftproc = 100-target.doneproc;
        //     console.log(target.doneproc)
        //     console.log(target.leftproc)
        // })
        Handlebars.registerPartial('target', Handlebars.templates.target);
        Handlebars.registerPartial('sub_level', Handlebars.templates.sub_level);
        Handlebars.registerPartial('comment', Handlebars.templates.comment);
        Handlebars.registerPartial('post', Handlebars.templates.post);
        rootElement.innerHTML = Handlebars.templates.author_profile(profile);
    } else {
        rootElement.innerHTML = Handlebars.templates.user_profile(profile);
    }
};
