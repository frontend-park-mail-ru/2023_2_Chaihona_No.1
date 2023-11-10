import {
    INCORRECT_LOGIN_ERROR_TEXT, LOGIN_ERROR_TEXT,
    MIN_FAIL_RESPONSE, NOT_FOUND_URL,
    PASS_REQUIREMENTS_TEXT,
    ROOT_ELEMENT_ID
} from "@configs/common_config.js";
import settings from '@components/Settings/settings.handlebars'

import css from '@components/Settings/settings.scss'
import {Api} from "@modules/api";
import Navbar from "@components/Navbar/Navbar.js";
import profileImg from '@static/icons/Account.svg'

const BACK_ELEMENT_ID = 'back';
const LOGIN_ELEMENT_ID = 'login';
const OLD_PASS_ELEMENT_ID = 'old-password';
const NEW_PASS_ELEMENT_ID = 'new-password';
const UPLOAD_AVA_ID = 'upload-avatar';
const PROFILE_ICON_ID = 'profile-icon';

const SAVE_PROFILE_BUTTON_CLASS = '.settings__grid-params-buttons-save';
const SETTINGS_AVA_CLASS = '.settings__grid-params-ava-grid-ava-pic';
const ERROR_FIELD_CLASS = '.settings__grid-params-error-field';

const imgExtRegExp = /(jp(e)?g|png)$/;

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

function checkImgExtension(imgName) {
    const re = new RegExp(imgExtRegExp);
    return re.test(imgName);
}

export default async () => {
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = settings();
    const saveButton = document.querySelector(SAVE_PROFILE_BUTTON_CLASS);
    const errorElement = document.querySelector(ERROR_FIELD_CLASS);
    const api = new Api();
    const profileRequest = await api.getUserProfile(window.user.id);

    const profileIcon = document.getElementById(PROFILE_ICON_ID)
    profileIcon.src = profileImg;

    if (profileRequest.status >= MIN_FAIL_RESPONSE) {
        window.router.redirect(NOT_FOUND_URL);
    }

    const backElement = document.getElementById(BACK_ELEMENT_ID);

    backElement.addEventListener('click', () => {
        router.redirect('profile' + window.user.id);
    })

    const profile = profileRequest.data.body.profile;

    const setAva = document.querySelector(SETTINGS_AVA_CLASS)
    setAva.src = await api.getAvatar(profile.user.id);

    const avatarField = document.getElementById(UPLOAD_AVA_ID);

    let avaBlob = null;

    avatarField.addEventListener('change', (e) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const upImage = reader.result;
            setAva.src = upImage;
        })
        avaBlob = e.target.files[0];
        if (!checkImgExtension(avaBlob.name)) {
            errorElement.textContent = 'Картинка должна быть в разрешении jpg или png';
            e.target.value = null;
            return;
        }
        reader.readAsDataURL(e.target.files[0]);
    })

    saveButton.addEventListener('click', async () => {
        const newLoginField = document.getElementById(LOGIN_ELEMENT_ID);
        const newPassField = document.getElementById(NEW_PASS_ELEMENT_ID);
        const oldPassField = document.getElementById(OLD_PASS_ELEMENT_ID);
        const newLogin = newLoginField.value;
        const newPass = newPassField.value;
        const oldPass = oldPassField.value;
        const avatarFile = avaBlob;
        const formData = new FormData();

        if (newLogin !== '') {
            if (!verifyLogin(newLogin)) {
                errorElement.textContent = LOGIN_ERROR_TEXT;
                return
            } else {
                profile.user.login = newLogin;
            }
        }
        if (newPass !== '') {
            if (!verifyPassword(newPass)) {
                errorElement.textContent = PASS_REQUIREMENTS_TEXT;
                return;
            }
            formData.append('new_password', newPass);
        }
        if (oldPass !== '') {
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
            errorElement.textContent = 'Неправильный старый пароль';
        } else {
            if (avatarFile) {
                await Navbar({id: window.user.id});
            }
            window.router.redirect('profile' + window.user.id);
        }
    })
};