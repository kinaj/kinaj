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

    if (ctx.xhr) tmpl = 'admin/partials/projects-list.html';

    ctx['projects'] = projects.map(function(p) { return p.__doc; })

    res.template(200, {}, tmpl, ctx);
  });
};

exports.newForm = function(req, res, ctx) {
  var tmpl = 'admin/projects-new.html'

  if (ctx.xhr) tmpl = 'admin/partials/projects-form.html';

  ctx['project'] = {}
  ctx['_form'] = { submit: 'create'
                 , action: '/projects/create'
                 , method: 'post'
                 , create: true
                 }

  res.template(200, {}, tmpl, ctx);
};

exports.editForm = function(req, res, ctx) {
  var tmpl = 'admin/projects-edit.html'

    ctx['_form'] = { submit: 'update'
                   , action: '/projects/' + ctx.params.slug + '/update'
                   , method: 'put'
                   }

  if (ctx.xhr) tmpl = 'admin/partials/projects-form.html';

  Project.find({ 'slug': ctx.params.slug }).first(function(project) {
    if (!project) return res.redirect('/projects');

    ctx['project'] = project

    res.template(200, {}, tmpl, ctx);
  });
};
