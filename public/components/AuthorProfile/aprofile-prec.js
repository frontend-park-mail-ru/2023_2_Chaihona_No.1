(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['author_profile'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"target"),depth0,{"name":"target","data":data,"indent":"                ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "                <div class=\"target-separator\"></div>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"post"),depth0,{"name":"post","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <div class='target-separator'></div>\r\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"sub_level"),depth0,{"name":"sub_level","data":data,"indent":"                ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<link rel=\"stylesheet\" href=\"components/AuthorProfile/author_profile.css\">\r\n<div class=\"user-cover\"></div>\r\n\r\n<div class=\"page-data\">\r\n\r\n    <div class=\"left-column\">\r\n        <div class=\"ava-block\">\r\n            <div class=\"ava\">\r\n                <img src=\"img/rg-ava.png\" style=\"height: 100%; width: 100%; object-fit: cover;\">\r\n            </div>\r\n\r\n            <div class=\"subs-amount\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"subscribers") || (depth0 != null ? lookupProperty(depth0,"subscribers") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subscribers","hash":{},"data":data,"loc":{"start":{"line":12,"column":37},"end":{"line":12,"column":52}}}) : helper)))
    + "</div>\r\n            <div class=\"subs-word\">Подписчиков</div>\r\n            <button class=\"ava-btn\">Отслеживать</button>\r\n            <button class=\"donut-btn\">Отправить донат</button>\r\n        </div>\r\n        <div class=\"target-block\">\r\n            <div class=\"target-word\">Цели</div>\r\n            <div class=\"target-separator\"></div>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"targets") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":12},"end":{"line":23,"column":21}}})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n\r\n    <div class=\"main-data\">\r\n        <div class=\"name-and-status\">\r\n            <div class=\"nickname\">"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"login") : stack1), depth0))
    + "</div>\r\n            <div class=\"status\">"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"status") : stack1), depth0))
    + "</div>\r\n        </div>\r\n\r\n        <div class=\"about-author\">\r\n            <div style=\"font-weight: 700; font-size: 3rem;\">Об авторе</div>\r\n            <div class=\"target-separator\" style=\"margin-top: 3%; margin-bottom: 3%;\"></div>\r\n            <div style=\"font-weight: 400; font-size: 1rem; color: rgba(0, 0, 0, 0.60);\"> "
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":36,"column":89},"end":{"line":36,"column":104}}}) : helper)))
    + " </div>\r\n        </div>\r\n\r\n        <div class=\"switch-and-search\">\r\n            <span> Лента </span>\r\n            <span style=\"margin-left: 2%;\"> Медиа </span>\r\n        </div>\r\n\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"posts") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":8},"end":{"line":46,"column":17}}})) != null ? stack1 : "")
    + "    </div>\r\n\r\n\r\n    <div class=\"right-column\">\r\n        <div class=\"subscriptions\">\r\n            Уровни подписки\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"sub_levels") : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":12},"end":{"line":56,"column":21}}})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n</div>";
},"usePartial":true,"useData":true});
})();