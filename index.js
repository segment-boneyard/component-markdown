var Builder = require('component-builder')
  , fs = require('fs')
  , path = require('path')
  , marked = require('marked')
  , str2js = require('string-to-js')
  , debug = require('debug')('component-markdown');


/**
 * Plugin.
 *
 * @param {Object} builder or markdown options
 */

module.exports = function (builder) {
  debugger;

  // no options
  if (builder instanceof Builder) return compileMarkdown(builder);

  // options
  exports.options(builder);
  return compileMarkdown;
};


/**
 * Set options. Passes 'em straight to marked, go wild.
 *
 * @param {Object} options
 */

exports.options = function (options) {
  marked.setOptions(options);
};


/**
 * Compile Markdown.
 *
 * @param {Object} builder
 */

function compileMarkdown (builder) {
  builder.hook('before scripts', function (builder, callback) {
    if (!builder.config.templates) return callback();

    var templates = builder.config.templates.filter(filterMarkdown);

    templates.forEach(function (file) {
      debug('compiling: %s', file);

      var str = fs.readFileSync(builder.path(file), 'utf8');
      var html = marked(str);
      var js = str2js(html);

      builder.addFile('scripts', file + '.js', js);
      builder.removeFile('templates', file);
    });

    callback();
  });
}


/**
 * Markdown matcher.
 *
 * Use the same file types that Github allows:
 * https://github.com/github/markup/blob/b865add2e053f8cea3d7f4d9dcba001bdfd78994/lib/github/markups.rb#L1
 */

var matcher = /\.(md|mkdn?|mdown|markdown)/;


/**
 * Filter for Markdown files.
 *
 * @param {String} filename
 * @return {Boolean}
 */

function filterMarkdown (filename) {
  return matcher.test(path.extname(filename));
}