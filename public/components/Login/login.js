import {Api} from "../../modules/api.js";
import navbar from "../Navbar/Navbar.js";

//3-16 символов латинского алфавита/цифр/нижних подчёркиваний/тире
const loginRegExp = /^[A-z0-9_-]{3,16}$/;

//от 8 латинских символов, обязательно заглавные и строчные, цифры, спец символы
const passRegExp = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g;

function verifyLogin(login) {
   const re = new RegExp(loginRegExp);
   return re.test(login);
}

function verifyPassword(password) {
   const re = new RegExp(passRegExp);
   return re.test(password);
}

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
        if (!verifyLogin(login.value)) {
            const err = document.querySelector(".error");
            err.textContent = "Логин должен быть от 3 до 16 символов и может содержать только цифры, латинские буквы и - _.";
            err.style = "color: #ef3a0c";
            return
        }
        if (!verifyPassword(pass.value)) {
            const err = document.querySelector(".error");
            err.textContent = "Пароль должен быть длиннее 8 символов и содержать буквы разных регистров, цифры и хотя бы один специальынй символ !@#$%^&*";
            err.style = "color: #ef3a0c";
            return
        }
        const result = await api.login(login.value, pass.value);
        if (result.status >= 400) {
            const err = document.querySelector(".error");
            err.textContent = "Неправильный логин или пароль";
            err.style = "color: #ef3a0c";
            return;
        }
        const id = result.data.body.id
        const user = {id: "1"};
	navbar(user);
        window.router.redirect('/profile' + id)
    });
}
