var path = require('path')
  , runtime = process.env['RUNTIME'] || 'development';

exports.runtime = runtime;
exports.baseDir = __dirname;
exports.viewDir = path.join(__dirname, 'views');
exports.appDomain = (runtime === 'development') ? 'kinaj.dev' : 'kinaj.com';
exports.domain = (runtime === 'development') ? 'kinaj.dev' : 'kinaj.com';
