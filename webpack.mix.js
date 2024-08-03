let mix = require('laravel-mix');
const library = 'SimpleConsent';

mix.options({
  terser: {
    extractComments: false,
    terserOptions: {
      format: {
        beautify: false,
        comments: /^\*!/,
      },
      output: {
        preserve_annotations: true
      },
    },
  },
});

mix.copy(`src/${library}.js`, `dist/${library}.js`)
  .copy(`src/${library}.css`, `dist/${library}.css`);

if (mix.inProduction()) {

  mix.minify(`src/${library}.js`, `dist/${library}.min.js`)
    .css(`src/${library}.css`, `dist/${library}.min.css`)
    .options({
      terser: {
        terserOptions: {
          compress: {
            drop_console: true,
        }
        },
      },
    });

}
