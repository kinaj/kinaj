exports.dashboard = function(req, res, params) {
  if (params.xhr) {
    res.template(200, {}, 'admin/partials/dashboard.html', {});
  } else res.template(200, {}, 'admin/dashboard.html', {});
};
