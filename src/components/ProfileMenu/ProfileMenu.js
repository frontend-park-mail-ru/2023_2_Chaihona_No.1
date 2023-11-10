import {MOUSE_CLICK_EVENT} from "@configs/common_config.js";

import profileIcon from '@static/icons/Account.svg'
import settingsIcon from '@static/icons/Settings.svg'

const PROFILE_MENU_BUTTON_ID = 'my_profile_button';
const SETTINGS_MENU_BUTTON_ID = 'profile_settings_button';

import css from './ProfileMenu.scss'

export default () => {
    const profileBtn = document.getElementById(PROFILE_MENU_BUTTON_ID);
    profileBtn.children[0].src = profileIcon;
    profileBtn.addEventListener(MOUSE_CLICK_EVENT, e => {
        return window.router.redirect('/profile' + window.user.id);
    })
    const settingsBtn = document.getElementById(SETTINGS_MENU_BUTTON_ID);
    settingsBtn.children[0].src = settingsIcon;
    settingsBtn.addEventListener(MOUSE_CLICK_EVENT, e => {
        return window.router.redirect('/settings');
    })

}
