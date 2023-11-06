import {
    INCORRECT_LOGIN_ERROR_TEXT, LOGIN_ERROR_TEXT,
    MIN_FAIL_RESPONSE, NOT_FOUND_URL,
    PASS_REQUIREMENTS_TEXT,
    ROOT_ELEMENT_ID
} from "@configs/common_config.js";
import settings from '@components/Settings/settings.handlebars'

import css from '@components/Settings/settings.css'
import {Api} from "@modules/api";

const loginRegExp = /^[A-z0-9_-]{5,16}$/;

// от 8 латинских символов, обязательно заглавные и строчные, цифры, спец символы
const passRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

/**
 * Проверяет логин на соответствие требованиям
 * @param login - логин
 * @returns {boolean} - соответствует ли логин требованиям
 */
function verifyLogin(login) {
    const re = new RegExp(loginRegExp);
    return re.test(login);
    //return true
}

/**
 *
 * Проверяет пароль на соответствие требованиям
 * @param password - пароль
 * @returns {boolean} - соответствует ли пароль требованиям
 */
function verifyPassword(password) {
    const re = new RegExp(passRegExp);
    return re.test(password);
    //return true
}

export default async () => {
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = settings();
    const saveButton = document.querySelector('.save-profile-button');
    const api = new Api();
    const profileRequest = await api.getUserProfile(window.user.id);

    if (profileRequest.status >= MIN_FAIL_RESPONSE) {
        window.router.redirect(NOT_FOUND_URL);
    }

    const backElement = document.getElementById('back');

    backElement.addEventListener('click', () => {
        router.redirect('profile' + window.user.id);
    })

    const profile = profileRequest.data.body.profile;

    const setAva = document.querySelector(".settings-ava")
    setAva.src = await api.getAvatar(profile.user.id);

    const avatarField = document.getElementById('upload-avatar');

    avatarField.addEventListener('change', () => {
        const avatar = avatarField.files[0]
        setAva.src = `url(${avatar})`;
    })

    saveButton.addEventListener('click', async () => {
        const errorElement = document.querySelector('.errorField');
        const newLoginField = document.getElementById('login');
        const newPassField = document.getElementById('new-password');
        const oldPassField = document.getElementById('old-password');
        const newLogin = newLoginField.value;
        const newPass = newPassField.value;
        const oldPass = oldPassField.value;
        const avatarFile = avatarField.files[0];
        const formData = new FormData();

        if (newLogin !== undefined) {
            if (!verifyLogin(newLogin)) {
                errorElement.textContent = LOGIN_ERROR_TEXT;
                return
            } else {
                profile.user.login = newLogin;
            }
        }
        if (newPass !== undefined) {
            if (!verifyPassword(newPass)) {
                errorElement.textContent = PASS_REQUIREMENTS_TEXT;
                return;
            }
            formData.append('new_password', newPass);
        }
        if (oldPass !== undefined) {
            if (!verifyPassword(oldPass)) {
                errorElement.textContent = PASS_REQUIREMENTS_TEXT;
                return;
            }
            formData.append('old_password', oldPass);
        }

        formData.append('id', profile.user.id);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        formData.append('login', profile.user.login);
        formData.append('status', profile.user.status);
        formData.append('description', profile.user.description);


        const response = await api.updateProfileFD(formData, profile.user.id);
        if (response.data.error === 'password_missmatch') {
            errorElement.textContent = 'Неправильный старый пароль'
        } else {
            window.router.redirect('profile' + window.user.id);
        }
    })
};