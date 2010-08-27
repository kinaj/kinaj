var Project = require('../models').Project;

exports.create = function(req, res, ctx) {
  project = new Project();

  for (var key in ctx.fields) project[key] = ctx.fields[key];

  project.save(function() {
    var redirect = '/projects/' + project.slug + '/edit';

    if (ctx.xhr) {
      res.simple(200, { redirect: redirect }, {});
    } else res.redirect(redirect);
  });
};

exports.update = function(req, res, ctx) {
  Project.find({ slug: ctx.params.slug }).first(function(project) {
    for (var key in ctx.fields) project[key] = ctx.fields[key];

    project.save(function() {
      res.redirect('/projects/' + project.slug + '/edit');
    });
  });
};

exports.del = function(req, res, ctx) {
  var msg = 'project successfully delete';

  Project.find({ slug: ctx.params.slug }).first(function(project) {
    if(!project) res.simple(404, 'Not Found\n', {})

    project.remove(function() {
      if (ctx.xhr) {
        res.simple(200, { msg: msg }, {});
      } else {
        ctx.flash.push(msg, function() {
          res.redirect('/projects');
        });
      }
    });
  });
};

exports.list = function(req, res, ctx) {
  Project.find({}).all(function(projects) {
    var tmpl = 'admin/projects-manage.html'
      , t = { projects: projects.map(function(p) { return p.__doc; }) };

    if (ctx.xhr) tmpl = 'admin/partials/projects-list.html';

    res.template(200, {}, tmpl, t);
  });
};

exports.newForm = function(req, res, ctx) {
  var tmpl = 'admin/projects-new.html'
    , t = { project: {}
            , _form: { submit: 'create'
                     , action: '/projects/create'
                     , method: 'post'
                     , create: true
                     }
            };

  if (ctx.xhr) tmpl = 'admin/partials/projects-form.html';

  res.template(200, {}, tmpl, t);
};

exports.editForm = function(req, res, ctx) {
  var tmpl = 'admin/projects-edit.html'
    , t =   { _form: { submit: 'update'
                     , action: '/projects/' + ctx.params.slug + '/update'
                     , method: 'put'
                     }
            };

  if (ctx.xhr) tmpl = 'admin/partials/projects-form.html';

  Project.find({ 'slug': ctx.params.slug }).first(function(project) {
    if (!project) return res.redirect('/projects');

    t.project = project;

    res.template(200, {}, tmpl, t);
  });
};
