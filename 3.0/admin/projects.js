var sys = require('sys')
  , Project = require('../models').Project
  , ins = function(x) { return sys.debug(sys.inspect(x, true, 5)); };

exports.list = function(req, res, params) {
  Project.find({}).all(function(projects) {
    res.template(200, {}, 'admin/projects/list.html', {
      projects: projects.map(function(p) { return p.__doc; })
    });
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
  res.template(200, {}, 'admin/projects/form.html', {
    _form: { submit: 'create'
           , action: '/projects/create'
           , method: 'post'
           }
  });
};

exports.editForm = function(req, res, params) {
  Project.find({ 'slug': params.slug }).first(function(project) {
    ctx = project.__doc;
    ctx._form = { submit: 'update'
                , action: '/projects/' + params.slug + '/update'
                , method: 'put'
                };

    res.template(200, {}, 'admin/projects/form.html', ctx);
  });
};
