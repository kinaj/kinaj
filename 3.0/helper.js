var fs = require('fs')
  , path = require('path')
  , qs = require('querystring')
  , exec = require('child_process').exec
  , CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');


exports.fastUUID = function() {
  var chars = CHARS, uuid = new Array(36), rnd=0, r;
  for (var i = 0; i < 36; i++) {
    if (i==8 || i==13 ||  i==18 || i==23) {
      uuid[i] = '';
    } else if (i==14) {
      uuid[i] = '4';
    } else {
      if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
      r = rnd & 0xf;
      rnd = rnd >> 4;
      uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
    }
  }
  return uuid.join('');
};

exports.serializeCookie= function(name, val, obj){
    var pairs = [name + '=' + qs.escape(val)],
        obj = obj || {},
        keys = Object.keys(obj);
    for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i],
            val = obj[key];
        if (val instanceof Date) {
            val = val.toUTCString();
        } else if (typeof val === "boolean") {
            if (val === true) {
                pairs.push(key);
            }
            continue;
        }
        pairs.push(key + '=' + val);
    }
    return pairs.join('; ');
};

exports.parseCookie = function(str) {
  var obj = {}
    , pairs = str.split(/[;,] */);

  for (var i = 0, len = pairs.length; i < len; ++i) {
      var pair = pairs[i]
        , eqlIndex = pair.indexOf('=')
        , key = pair.substr(0, eqlIndex).trim().toLowerCase()
        , val = pair.substr(++eqlIndex, pair.length).trim();

      // Quoted values
      if (val[0] === '"') {
          val = val.slice(1, -1);
      }

      // Only assign once
      if (obj[key] === undefined) {
          obj[key] = qs.unescape(val, true);
      }
  }

  return obj;
};

exports.sessionFingerprint = function(sid, req) {
  var ret = 'session:' + sid + ':' + req.socket.remoteAddress
    , ua = req.headers['user-agent'];

  if (ua) ret += ':' + ua;

  return ret;
};

exports.moveAttachment = function(file, slug, dir, cb) {
  dir = path.join(dir, slug, 'attachments')

  exec('mkdir -p ' + dir, function(err, stdout, stderr) {
    if(err) throw err

    var target = path.join(dir, file.filename)

    fs.rename(file.path, target, function(err) {
      if(err) throw err

      if(cb) cb(target)
    })
  })
}

exports.rmdir = function(path, cb) {
  exec('rm -r ' + path, function(err, stdout, stderr) {
    if(err) throw err
  
    if(cb) cb()
  })
  fs.rmdir(path, function(err) {

  })
}
