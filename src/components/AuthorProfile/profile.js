import {Api} from '@modules/api.js';
import {MIN_FAIL_RESPONSE, NOT_FOUND_URL, PROFILE_URL,} from '@configs/common_config.js';
import post from '@components/Post/post.js';

import aprofile from '@components/AuthorProfile/author_profile.handlebars'
import uprofile from '@components/UserProfile/user_profile.handlebars'

import profileSettingIcon from '@static/icons/Settings2.svg';
import defaultAvaImg from '@static/img/default-ava.png';
//todo: назвать нормально =)

const AUTHOR_USER_TYPE = 'creator';

/**
 * Функция отрисовки страницы пользователя
 */
export default async () => {
    const rootElement = document.querySelector('#root');
    rootElement.innerHTML = '';

    // отрезаем от url id профиля
    const currUrl = window.location.href.split('/').pop();
    const id = currUrl.replace(PROFILE_URL, '');

    const isOwner = (window.user.id === Number(id));

    // забираем пользователя
    const api = new Api();
    const profileRequest = await api.getUserProfile(id);

    if (profileRequest.status >= MIN_FAIL_RESPONSE) {
        window.router.redirect(NOT_FOUND_URL);
    }

    const profile = profileRequest.data.body.profile;
    window.sub_levels = profile.subscribe_levels;

    // если пользователь автор - забираем посты и рендерим страницу, иначе просто рендерим страницу
    if (profile.user.is_author) {
        const postsRequest = await api.getUserPosts(id);
        if (postsRequest.status >= MIN_FAIL_RESPONSE) {
            window.router.redirect(NOT_FOUND_URL);
        }
        profile.posts = postsRequest.data.body.posts;

        // может быть профиль без целей
        if (profile.targets !== undefined) {
            profile.targets.forEach((target) => {
                target.doneproc = (target.done / target.target) * 100;
                target.leftproc = 100 - target.doneproc;
            });
        }

        profile.isOwner = isOwner;

        rootElement.innerHTML = aprofile(profile);

        if (isOwner) {
            const newPostButton = document.getElementById('new-post-button')

            newPostButton.addEventListener('click', () => {
                window.router.redirect('newpost');
            })
        } else {
            const subButton = document.getElementById('sub_button');

            subButton.addEventListener('click', (event) => {
                const subBtn = event.target;
                const subbed = subBtn.dataset.subbed;
                const subsAmount = document.querySelector('.subs-amount');
                if (subbed === 'true') {
                    subBtn.classList.remove('ava-clicked-btn');
                    subBtn.classList.add('ava-btn');
                    subBtn.dataset.subbed = 'false';
                    subBtn.textContent = 'Отслеживать';
                    subsAmount.textContent = String(Number(subsAmount.textContent) - 1);
                } else {
                    subBtn.classList.remove('ava-btn');
                    subBtn.classList.add('ava-clicked-btn');
                    subBtn.dataset.subbed = 'true';
                    subBtn.textContent = 'Перестать отслеживать';
                    subsAmount.textContent = String(Number(subsAmount.textContent) + 1);
                }
            });
        }
        post(isOwner);
    } else {
        profile.isOwner = isOwner;
        rootElement.innerHTML = uprofile(profile);
        document.querySelectorAll('.sub-pic').forEach((subPic) => subPic.src=defaultAvaImg);
    }

    const avatarElement = document.querySelector('.ava-img');
    avatarElement.src = await api.getAvatar(id);

    if (isOwner) {
        const statusSettingButton = document.getElementById("status-setting");
        statusSettingButton.src = profileSettingIcon;
        statusSettingButton.addEventListener('click', () => {
            const dialog = document.getElementById("status_dialog");
            dialog.showModal();
            const statusElement = document.getElementById("user_status");
            const statusData = document.getElementById("status_input");
            statusData.value = statusElement.textContent;
            const statusVerifyButton = document.getElementById('status_save_btn');
            statusVerifyButton.addEventListener('click', async () => {
                profile.user.status = statusData.value;
                await api.updateProfile(profile);
                dialog.close();
                statusElement.innerHTML = statusData.value;
            })
        });

        if (profile.user.is_author) {
            const aboutSettingButton = document.getElementById("about-setting");
            aboutSettingButton.src = profileSettingIcon;
            aboutSettingButton.addEventListener('click', () => {
                const dialog = document.getElementById("about_dialog");
                dialog.showModal();
                const aboutElement = document.getElementById("user_about");
                const aboutData = document.getElementById("about_input");
                aboutData.value = aboutElement.textContent;
                const statusVerifyButton = document.getElementById('about_save_btn');
                statusVerifyButton.addEventListener('click', async () => {
                    profile.user.description = aboutData.value;
                    await api.updateProfile(profile);
                    dialog.close();
                    aboutElement.innerHTML = aboutData.value;
                })
            });
        }
    }
};
