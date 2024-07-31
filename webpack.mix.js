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
    },
  },
});

if (mix.inProduction()) {
  mix.minify(`src/${library}.js`, `dist/${library}.min.js`)
    .css(`src/${library}.css`, `dist/${library}.min.css`);
} else {
  mix.minify(`src/${library}.js`, `dist/${library}.js`)
    .css(`src/${library}.css`, `dist/${library}.css`);
}