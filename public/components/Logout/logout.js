import {Api} from "../../modules/api.js";
import navbar from "../Navbar/Navbar.js";

export default async() => {
  const api = new Api();
  await api.logout();
  navbar();
  window.router.redirect('/')
}
