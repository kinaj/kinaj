exports.dashboard = function(req, res, ctx) {
  if (ctx.xhr) {
    res.template(200, {}, 'admin/partials/dashboard.html', {});
  } else res.template(200, {}, 'admin/dashboard.html', {});
};
