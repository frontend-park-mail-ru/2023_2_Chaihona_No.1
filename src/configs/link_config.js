import profile from '@components/AuthorProfile/profile.js';
import notfound from '@components/NotFound/notfound.js';
import login from '@components/Login/login.js';
import register from '@components/Register/register.js';
import settings from "@components/Settings/settings.js";
import PostEdit from "@components/PostEdit/PostEdit.js";
import PostNew from "@components/PostEdit/PostNew.js";

/**
 * Массив объектов с url и функциями отрисовки страниц
 */
export const routes = {
  profile: {
    render: profile,
  },
  login: {
    render: login,
  },
  register: {
    render: register,
  },
  notfound: {
    render: notfound,
  },
  settings: {
    render: settings,
  },
  newpost: {
    render: PostNew
  },
  editpost: {
    render: PostEdit
  }
};
