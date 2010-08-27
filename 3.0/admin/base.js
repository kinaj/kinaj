exports.dashboard = function(req, res, ctx) {
  var tmpl = 'admin/dashboard.html'

  if (ctx.xhr) tmpl = 'admin/partials/dashboard.html'

  res.template(200, {}, tmpl, ctx);
};
