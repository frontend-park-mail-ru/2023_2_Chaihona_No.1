(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['comment'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<link rel=\"stylesheet\" href=\"components/Comment/comment.css\">\n<div class=\"comment\">\n    <div class=\"comment-ava\"><img src=\"img/default-ava.png\"></div>\n    <div class=\"comment-data\">\n        <div class = \"comment-nickname\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"user") : depth0)) != null ? lookupProperty(stack1,"login") : stack1), depth0))
    + "</div>\n        <div class = \"comment-text\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"text") || (depth0 != null ? lookupProperty(depth0,"text") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"text","hash":{},"data":data,"loc":{"start":{"line":6,"column":36},"end":{"line":6,"column":44}}}) : helper)))
    + "</div>\n        <div class = \"comment-date\">"
    + alias1(((helper = (helper = lookupProperty(helpers,"creation_date") || (depth0 != null ? lookupProperty(depth0,"creation_date") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"creation_date","hash":{},"data":data,"loc":{"start":{"line":7,"column":36},"end":{"line":7,"column":53}}}) : helper)))
    + "</div>\n    </div>\n</div>";
},"useData":true});
})();