var config = require('../config')
  , helper = require('../helper')
  , Project = require('../models').Project;

exports.create = function(req, res, params) {
  project = new Project();

  for (var key in params.fields) project[key] = params.fields[key];

  project.save(function() {
    var redirect = '/projects/' + project.slug + '/edit';

    if (params.xhr) {
      res.simple(200, { redirect: redirect }, {});
    } else res.redirect(redirect);
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
  var msg = 'project successfully delete';

  Project.find({ slug: params.slug }).first(function(project) {
    project.remove(function() {
      if (params.xhr) {
        res.simple(200, { msg: msg }, {});
      } else {
        params.flash.push(msg, function() {
          res.redirect('/projects');
        });
      }
    });
  });
};

exports.upload = function(req, res, params) {
  var orig = params.files.attachment;

  helper.moveFile(orig.path, config.uploadDir + '/' + orig.filename, function() {
    res.simple(200, 'ok', {});
  });
};

exports.list = function(req, res, params) {
  Project.find({}).all(function(projects) {
    var tmpl = 'admin/projects-manage.html'
      , ctx = { projects: projects.map(function(p) { return p.__doc; }) };

    if (params.xhr) tmpl = 'admin/partials/projects-list.html';
    
    res.template(200, {}, tmpl, ctx);
  });
};

exports.newForm = function(req, res, params) {
  var tmpl = 'admin/projects-new.html'
    , ctx = { project: {}
            , _form: { submit: 'create'
                     , action: '/projects/create'
                     , method: 'post'
                     }
            };
  
  if (params.xhr) tmpl = 'admin/partials/projects-form.html';

  res.template(200, {}, tmpl, ctx);
};

exports.editForm = function(req, res, params) {
  var tmpl = 'admin/projects-edit.html'
    , ctx = {  _form: { submit: 'update'
                     , action: '/projects/' + params.slug + '/update'
                     , method: 'put'
                     }
            };

  if (params.xhr) tmpl = 'admin/partials/projects-form.html';

  Project.find({ 'slug': params.slug }).first(function(project) {
    if (!project) return res.redirect('/projects');

    ctx.project = project;

    res.template(200, {}, tmpl, ctx);
  });
};
