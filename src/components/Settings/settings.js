import {ROOT_ELEMENT_ID} from "@configs/common_config.js";
import settings from '@components/Settings/settings.handlebars'

import css from '@components/Settings/settings.css'

export default () => {
    const rootElement = document.querySelector(ROOT_ELEMENT_ID);
    rootElement.innerHTML = settings();
};