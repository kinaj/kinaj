var sys = require('sys')
  , Project = require('../models').Project
  , ins = function(x) { return sys.debug(sys.inspect(x, true, 5)); };

exports.list = function(req, res, params) {
  Project.find({}).all(function(projects) {
    var projects = projects.map(function(p) { return p.__doc; })

    ins(params);

    if (params.xhr) {
      res.template(200, {}, 'admin/partials/projects-list.html', { projects: projects });
    } else res.template(200, {}, 'admin/projects-manage.html', { projects: projects });
  });
};

exports.create = function(req, res, params) {
  project = new Project();

  for (var key in params.fields) project[key] = params.fields[key];

  project.save(function() {
    res.redirect('/projects/' + project.slug + '/edit');
  });
};

exports.update = function(req, res, params) {
  Project.find({ slug: params.slug }).first(function(project) {
    for (var key in params.fields) project[key] = params.fields[key];

    project.save(function() {
      res.redirect('/projects/' + project.slug + '/edit');
    });
  });
};

exports.del = function(req, res, params) {
  Project.find({ slug: params.slug }).first(function(project) {
    project.remove(function() {
      params.flash.push('project successfully delete', function() {
        res.redirect('/projects');
      });
    });
  });
};

exports.newForm = function(req, res, params) {
  var form = { submit: 'create'
              , action: '/projects/create'
              , method: 'post'
              };
  
  if (params.xhr) {
    res.template(200, {}, 'admin/partials/projects-form.html', { _form: form });
  } else res.template(200, {}, 'admin/projects-new.html', { _form: form });
};

exports.editForm = function(req, res, params) {
  Project.find({ 'slug': params.slug }).first(function(project) {
    ctx = project.__doc;
    ctx._form = { submit: 'update'
                , action: '/projects/' + params.slug + '/update'
                , method: 'post'
                };

    if (params.xhr) {
      res.template(200, {}, 'admin/partials/projects-form.html', ctx);
    } else res.template(200, {}, 'admin/projects-edit.html', ctx);
  });
};
