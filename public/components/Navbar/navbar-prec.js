(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['navbar'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "        <button class=\"exit-btn\" id=\"exit-btn\"> Выйти </button>\n        <img src=\"img/default-ava.png\" class=\"nav-ava\">\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <button class=\"exit-btn\" id=\"login-btn\">Войти</button>\n        <button class=\"reg-btn\" id=\"reg-btn\"> Регистрация </button>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<link rel=\"stylesheet\" type=\"text/css\" href=\"components/Navbar/navbar.css\"/>\n<div class=\"navbar\">\n    <img src=\"img/logo.png\" class=\"navlogo\">\n    <button class=\"main-page-btn\">На главную</button>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"User") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":5,"column":4},"end":{"line":11,"column":12}}})) != null ? stack1 : "")
    + "    <input type=\"text\" placeholder=\"Поиск автора...\">\n</div>\n<script src=\"navbar_buttons.js\"></script>";
},"useData":true});
})();