# component-markdown

  A plugin to compile Markdown to Javascript for the component builder.

## Install

    $ npm install component-markdown

## Usage
  
  Add your Markdown files to the `documents` array in your `component.json`:

  ```js
  {
    "documents": [
      "readme.md",
      "history.markdown"
    ]
  }
  ```

  Use the plugin during your build process:

  ```js
  var fs       = require('fs')
    , Builder  = require('component-builder')
    , markdown = require('component-markdown');

  var builder = new Builder(__dirname);

  builder.use(markdown);

  builder.build(function(err, res){
    if (err) throw err;
    fs.writeFileSync('build/build.js', res.require + res.js);
    if (res.css) fs.writeFileSync('build/build.css', res.css);
  });
  ```

  And then require the files in your Javascript:

  ```js
  var tip     = require('tip')
    , readme  = require('readme')
    , history = require('history');
  ```