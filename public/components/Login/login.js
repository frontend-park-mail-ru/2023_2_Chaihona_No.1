import {Api} from "../../modules/api.js";
import navbar from "../Navbar/Navbar.js";

export default async() => {
    const rootElement = document.querySelector('#root');
    rootElement.innerHTML = '';
    rootElement.innerHTML = Handlebars.templates.login();


    const loginBtn = document.querySelector(".logbutton")
    loginBtn.addEventListener("click", async function (e) {
        e.preventDefault();
        const login = document.querySelector("#login");
        const pass = document.querySelector("#password");
        const api = new Api();
        const result = await api.login(login.value, pass.value);
        if (result.status >= 400) {
            const err = document.querySelector(".error");
            err.textContent = "Неправильный логин или пароль";
            return;
        }
        const id = result.data.body.id
        const user = {id: "1"};
	navbar(user);
        window.router.redirect('/profile' + id)
    });
}