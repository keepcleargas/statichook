var fs = require('fs');

var gitane = require('gitane');
var winston = require('winston');

function cloneInto(repoUrl, destPath, keyPath, callback) {
  var gitClone = function(keyData) {
    // clone with . to avoid the extra containing folder
    var gitCmd = 'git clone ' + repoUrl + ' .';
    winston.log('info', 'Cloning', repoUrl);
    winston.log('debug', 'Running git command:', gitCmd);
    gitane.run(destPath, keyData, gitCmd, function(err, stdout, stderr, exitCode) {
      callback(err, stdout, stderr, exitCode);
    });
  };
  
  // If there's a key, clone with the key; otherwise, clone with no key
  if (keyPath) {
    winston.log('debug', 'Using key:', keyPath);
    fs.readFile(keyPath, function(err, keyData) {
      if (err) { callback(err); return; }
      gitClone(keyData);
    });
  } else {
    winston.log('debug', 'No key provided');
    gitClone(null);
  }
}

module.exports = {
  cloneInto: cloneInto
};
