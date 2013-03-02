var Builder  = require('component-builder')
  , fs       = require('fs')
  , markdown = require('../');



var builder = new Builder(__dirname);

builder.use(markdown);

builder.build(function(err, res){
  if (err) throw err;
  fs.writeFileSync('example/build.js', res.require + res.js);
});