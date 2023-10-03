export default (user = null) => {
    const navbarElement = document.querySelector('#navbar');
    navbarElement.innerHTML = '';
    if (user) {
        navbarElement.innerHTML = Handlebars.templates.navbar({"User": {"id": "1"}});
        const logoutBtn = document.querySelector("#exit-btn")
        logoutBtn.addEventListener("click", function (e) {
            window.router.redirect('/logout');
        });
    } else {
        navbarElement.innerHTML = Handlebars.templates.navbar();
        const loginBtn = document.querySelector("#login-btn");

        loginBtn.addEventListener("click", function (e) {
            window.router.redirect('/login');
        });
        const regBtn = document.querySelector("#reg-btn")
        regBtn.addEventListener("click", function (e) {
            window.router.redirect('/register');
        });
    }
    const mainBtn = document.querySelector(".main-page-btn")
    mainBtn.addEventListener("click", function (e) {
        window.router.redirect('/nenahod');
    });
}
