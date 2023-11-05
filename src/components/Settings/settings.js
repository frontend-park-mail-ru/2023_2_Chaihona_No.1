import {INCORRECT_LOGIN_ERROR_TEXT, PASS_REQUIREMENTS_TEXT, ROOT_ELEMENT_ID} from "@configs/common_config.js";
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
    // const re = new RegExp(loginRegExp);
    // return re.test(login);
    return true
}

/**
 *
 * Проверяет пароль на соответствие требованиям
 * @param password - пароль
 * @returns {boolean} - соответствует ли пароль требованиям
 */
function verifyPassword(password) {
    // const re = new RegExp(passRegExp);
    // return re.test(password);
    return true
}

export default () => {
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = settings();
    const saveButton = document.querySelector('.save-profile-button');
    const api = new Api();
    const profile = api.getUserProfile(window.user.id);
    saveButton.addEventListener('click', async () => {
        const errorElement = document.querySelector('.error');
        const newLoginField = document.getElementById('login');
        const newPassField = document.getElementById('new-password');
        const oldPassField = document.getElementById('old-password');
        const newLogin = newLoginField.value;
        const newPass = newPassField.value;
        const oldPass = oldPassField.value;
        if (!verifyLogin(newLogin)) {
            errorElement.textContent = ''
            return
        }
        if (!verifyLogin(newPass)) {
            errorElement.textContent = INCORRECT_LOGIN_ERROR_TEXT;
            return;
        }
        if (!verifyPassword(oldPass)) {
            errorElement.textContent = PASS_REQUIREMENTS_TEXT;
            return;
        }
        await api.updateProfile(profile);
    })
};