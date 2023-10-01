(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['login'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<link rel=\"stylesheet\" type=\"text/css\" href=\"components/Login/login.css\"/>\r\n<form action=\"login\" method=\"post\">\r\n    <div class=\"container\">\r\n        <script src=\"login.js\"></script>\r\n        <div class=\"error\"></div>\r\n        <form action=\"login\" method=\"post\">\r\n        <input type=\"login\" placeholder=\"Логин\" id=\"login\" name=\"login\" required><br>\r\n        <input type=\"password\" placeholder=\"Пароль\" id=\"password\" name=\"password\" required><br>\r\n        <input type=\"button\" class=\"logbutton\" name=\"buttonlog\" value=\"Войти\">\r\n        </form>\r\n        <p>Забыли пароль?</p>\r\n    </div>\r\n</form>";
},"useData":true});
})();