const { render, renderSync } = require('./lib/render');
const { extract, extractSync } = require('./lib/extract');

exports.render = render;
exports.renderSync = renderSync;
exports.extract = extract;
exports.extractSync = extractSync;

const res = exports.renderSync({
  file: require('path').join(__dirname, 'test.scss'),
});


console.log('vars sync', res.vars);

exports.render({
  file: require('path').join(__dirname, 'test.scss'),
})
.then(res => {
  console.log('vars async', res.vars);
}).done();


setInterval(() => {

}, 1000);
