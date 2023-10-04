(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['user_profile'] = template({"1":function(container,depth0,helpers,partials,data) {
    var lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <div class=\"sub-element\">\n                    <img src=\"img/default-ava.png\">\n                    "
    + container.escapeExpression(container.lambda((depth0 != null ? lookupProperty(depth0,"login") : depth0), depth0))
    + "\n                </div>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<link rel=\"stylesheet\" href=\"components/UserProfile/user_profile.css\">\n\n<div class=\"user-cover\"></div>\n\n<div class=\"page-data\">\n\n    <div class=\"left-column\">\n        <div class=\"ava-block\">\n            <div class=\"ava\"></div>\n            <div class=\"subs-amount\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"donated") : stack1), depth0))
    + "</div>\n            <div class=\"subs-word\">Пожертвовано</div>\n        </div>\n    </div>\n\n    <div class=\"main-data\">\n        <div class=\"name-and-status\">\n            <div class=\"nickname\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"login") : stack1), depth0))
    + "</div>\n            <div class=\"status\">"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"status") : stack1), depth0))
    + "</div>\n        </div>\n    </div>\n    <div class=\"right-column\">\n        <div class=\"subscriptions\">\n            Подписки\n            <div class = 'target-separator'></div>\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"subs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":25,"column":12},"end":{"line":30,"column":21}}})) != null ? stack1 : "")
    + "        </div>\n    </div>\n\n</div>";
},"useData":true});
})();