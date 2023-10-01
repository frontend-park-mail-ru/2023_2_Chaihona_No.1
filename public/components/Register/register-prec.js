(function () {
  const { template } = Handlebars;
  const templates = Handlebars.templates = Handlebars.templates || {};
  templates.register = template({
    compiler: [8, '>= 4.3.0'],
    main(container, depth0, helpers, partials, data) {
      return '<link rel="stylesheet" type="text/css" href="components/Register/register.css"/>\r\n<link rel="stylesheet" type="text/css" href="components/Register/switch.css"/>\r\n  <div class="container">\r\n    <script src="error.js"></script>\r\n    <div class="error"></div>\r\n      <form action="register" method="post">\r\n        <input type="login" placeholder="Логин" id="login" name="login" required><br>\r\n        <input type="password" placeholder="Пароль" id="password" name="password" required><br>\r\n        <input type="password" placeholder="Повторите пароль" id="repeat-password" name="password" required><br>\r\n          <div class="switch">\r\n          <input id="toggle" class="toggle" type="checkbox" role="switch" name="toggle" value="on">\r\n          <label for="toggle" class="slot">\r\n              <span class="slot__label">ДОНАТЕР</span>\r\n              <span class="slot__label">АВТОР</span>\r\n          </label>\r\n          </div>\r\n        <input type="submit" class="regbutton" value="Зарегистрироваться">\r\n      </form>\r\n  </div>';
    },
    useData: true,
  });
}());
