import {Api} from "../../modules/api.js";
import navbar from "../Navbar/Navbar.js";

export default async() => {
  const api = new Api();
  const result = await api.logout();
  if (result.status >= 400) {
      const err = document.querySelector(".error");
      err.textContent = "Произошла ошибка";
      return;
  }
  navbar();
  window.router.redirect('/')
}