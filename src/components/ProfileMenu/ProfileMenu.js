import {MOUSE_CLICK_EVENT} from "@configs/common_config.js";

const PROFILE_MENU_BUTTON_ID = 'my_profile_button';
const SETTINGS_MENU_BUTTON_ID = 'profile_settings_button';

export default () => {
    const profileBtn = document.getElementById(PROFILE_MENU_BUTTON_ID);
    profileBtn.addEventListener(MOUSE_CLICK_EVENT, e => {
        window.router.redirect('/profile' + window.user.id);
    })
    const settingsBtn = document.getElementById(SETTINGS_MENU_BUTTON_ID);
    settingsBtn.addEventListener(MOUSE_CLICK_EVENT, e => {
        window.router.redirect('/settings');
    })

}