var path = require('path')
  , runtime = process.env['RUNTIME'] || 'development';

exports.runtime = runtime;
exports.baseDir = __dirname;
exports.viewDir = path.join(__dirname, 'views');
exports.tmpDir = path.join(__dirname, 'tmp');
exports.uploadDir = path.join(__dirname, 'static', 'uploads');
exports.domain = (runtime === 'development') ? 'kinaj.dev' : 'kinaj.com';
exports.mongo = { serverAddress: 'localhost' 
                , serverPort: 27017
                , database: 'kinaj'
                };
