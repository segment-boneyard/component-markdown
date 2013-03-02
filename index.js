var fs     = require('fs')
  , path   = require('path')
  , marked = require('marked')
  , str2js = require('string-to-js')
  , debug  = require('debug')('component-markdown');



module.exports = compileMarkdown;


/**
 * Compile Markdown.
 */

function compileMarkdown (builder) {
  builder.hook('before scripts', function (builder, callback) {
    if (!builder.conf.documents) return callback();

    var documents = builder.conf.documents.filter(filterMarkdown);

    documents.forEach(function (file) {
      debug('compiling: %s', file);

      var contents = fs.readFileSync(builder.path(file), 'utf8')
        , html     = marked(contents)
        , js       = str2js(html)
        , name     = path.basename(file, path.extname(file)) + '.js';

      builder.addFile('scripts', name, js);
    });

    callback();
  });
}


/**
 * Set options. Passes 'em straight to marked, go wild.
 */

exports.options = function (options) {
  marked.setOptions(options);
};


/**
 * Markdown matcher.
 *
 * Use the same file types that Github allows:
 * https://github.com/github/markup/blob/b865add2e053f8cea3d7f4d9dcba001bdfd78994/lib/github/markups.rb#L1
 */

var matcher = /.(md|mkdn?|mdown|markdown)/;


/**
 * Filter for Markdown files.
 */

function filterMarkdown (filename) {
  return matcher.test(path.extname(filename));
}