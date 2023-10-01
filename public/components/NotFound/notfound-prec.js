(function () {
  const { template } = Handlebars;
  const templates = Handlebars.templates = Handlebars.templates || {};
  templates.notfound = template({
    compiler: [8, '>= 4.3.0'],
    main(container, depth0, helpers, partials, data) {
      return '<h1>404 NOT FOUND</h1>\r\n<h3>Мы пока что не сделали эту страницу =(</h3>\r\n<link rel="stylesheet" href="components/NotFound/NotFound.css">\r\n<div id="uwork">\r\n<img src="img/under_work.jpg">\r\n</div>';
    },
    useData: true,
  });
}());
