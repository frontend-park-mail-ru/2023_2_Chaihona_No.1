import { MOUSE_CLICK_EVENT } from '@configs/common_config.js';
import { Api } from '@modules/api';
import profileIcon from '@static/icons/Account.svg';
import settingsIcon from '@static/icons/Settings.svg';

import css from './ProfileMenu.scss';

const PROFILE_MENU_BUTTON_ID = 'my_profile_button';
const SETTINGS_MENU_BUTTON_ID = 'profile_settings_button';
const PROFILE_MENU_ANALYTICS_ID = 'profile_analytics_button';


export default () => {
  const profileBtn = document.getElementById(PROFILE_MENU_BUTTON_ID);
  profileBtn.children[0].src = profileIcon;
  profileBtn.addEventListener(MOUSE_CLICK_EVENT, (e) => {
    window.router.redirect(`/profile${window.user.id}`);
  });
  const settingsBtn = document.getElementById(SETTINGS_MENU_BUTTON_ID);
  settingsBtn.children[0].src = settingsIcon;
  settingsBtn.addEventListener(MOUSE_CLICK_EVENT, (e) => window.router.redirect('/settings'));
  const amalyticBtn = document.getElementById(PROFILE_MENU_BUTTON_ID);
  amalyticBtn.children[0].src = profileIcon;
  amalyticBtn.addEventListener(MOUSE_CLICK_EVENT, async (e) => {
    // window.router.redirect(`/profile${window.user.id}`);
    const api = new Api();
    const analyticsRequest = await api.analytics();
    console.log(analyticsRequest.body);
  });
};
