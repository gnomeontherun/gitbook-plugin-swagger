'use strict';

const fs = require('fs');
const path = require('path');
const bootprint = require('bootprint');
const crypto = require('crypto');
const swaggers = {};

module.exports = {
  book: {
    assets: './assets',
    js: [
      'plugin.js'
    ],
    css: [
      'plugin.css'
    ]
  },
  hooks: {
    page: function(page) {
      // Need to replace the content after it was rendered
      let regex = /\<swagger\>(.*?)\<\/swagger\>/gmi;
      let definition = regex.exec(page.content);

      // Replace if tag is found
      if (definition !== null) {
         page.content = page.content.replace(regex, swaggers[definition[1]]);
      }
      return page;
    },
    'page:before': function(page) {
      // Determine if the page contains a swagger file
      let regex = /\<swagger\>(.*?)\<\/swagger\>/gmi;
      let definition = regex.exec(page.content);

      // If so, build using bootprint and hold in swagger variable for later
      if (definition !== null) {
        let temp = '_tmp_' + crypto.createHash('md5').update(definition[1]).digest('hex');
        // Load bootprint
        return new Promise(
          function(resolve, reject) { 
            bootprint
              .load(require('bootprint-swagger'))
              .merge({
                less: {
                  main: [
                    require.resolve('./less/theme.less')
                  ]
                },
                handlebars: {
                  partials: path.join(__dirname, 'partials')
                }
              })
              // Define the  build into the temp directory (doesn't support render as a string) 
              .build(definition[1], temp) 
              // Generate the build
              .generate()
              // On completion, read the output back into memory and save it for later
              .done(function() {
                let file = fs.readFileSync(temp + '/index.html', 'utf8')
                let search = /<body[^>]*>((.|[\n\r])*)<\/body>/gmi;
                let content = search.exec(file);
                swaggers[definition[1]] = content[1];
                var exec = require('child_process').exec;
                exec('rm -r ' + temp);
                resolve(page);
              });
          }).then(function(page) {
            return page;
          });
      } else {
        return page;
      }
    }
  }
};
