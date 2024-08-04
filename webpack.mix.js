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
      compress: {
        drop_console: mix.inProduction(),
      }
    },
  },
});

mix.copy(`src/${library}.js`, `dist/${library}.js`)
  .copy(`src/${library}.css`, `dist/${library}.css`);

if (mix.inProduction()) {
  mix.minify(`src/${library}.js`, `dist/${library}.min.js`)
    .css(`src/${library}.css`, `dist/${library}.min.css`);
}
