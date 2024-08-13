let mix = require('laravel-mix');
const fs = require('fs');
const library = 'SimpleConsent';

mix.options({
  terser: {
    extractComments: false,
    terserOptions: {
      format: {
        beautify: false,
        comments: /^\*!/,
      },
      compress: {
        drop_console: mix.inProduction(),
      }
    },
  },
});

mix.copy(`src/${library}.js`, `dist/${library}.js`)
  .copy(`src/${library}.css`, `dist/${library}.css`)
  .copy(`src/${library}.js`, `testbench/assets/${library}.js`)
  .copy(`src/${library}.css`, `testbench/assets/${library}.css`);

if (mix.inProduction()) {
  mix.minify(`src/${library}.js`, `dist/${library}.min.js`)
    .css(`src/${library}.css`, `dist/${library}.min.css`)
    .then(() => {
      
      /**
       * This removes unnecessary newlines from the minified JS file inside template literals.
       * This must be a bug in the terser plugin - its just easier to fix it here.
       */
      let jsContent = fs.readFileSync(`dist/${library}.min.js`, 'utf8');
      jsContent = jsContent.replace(/\\n\s+/g, '');
      fs.writeFileSync(`dist/${library}.min.js`, jsContent);

    });
}
