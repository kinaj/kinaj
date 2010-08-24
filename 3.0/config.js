var path = require('path')
  , runtime = process.env['RUNTIME'] || 'development';

exports.runtime = runtime;
exports.baseDir = __dirname;
exports.viewDir = path.join(__dirname, 'views');
exports.tmpDir = path.join(__dirname, 'tmp');
exports.uploadDir = path.join(__dirname, 'static', 'uploads');
exports.domain = (runtime === 'development') ? 'kinaj.dev' : 'kinaj.com';
exports.redis = {
  host: '127.0.0.1',
  port: 6379
}
exports.mongo = {
  uri: 'mongodb://127.0.0.1:27017/kinaj_' + runtime
}
