# sass-vars

Extract structured variables from your sass files with no effort. Have all your style variables defined in style files, while being able to use them in javascript for things that cannot be styled with css such as complex visualisations or other dynamic content.

If you are using webpack make sure to also check out the [sass-vars-loader](https://github.com/jgranstrom/sass-vars-loader).

![demo](https://www.dropbox.com/s/we3euzpofmibk74/sass-vars-demo.gif?dl=1)
Demo of **sass-vars** using the [sass-vars-loader](https://github.com/jgranstrom/sass-vars-loader)

- [Installation](#installation)
- [API](#api)
  - [render(compileOptions)](#rendercompileoptions)
  - [renderSync(compileOptions)](#rendersynccompileoptions)
  - [extract(rendered, { compileOptions })](#extractrendered--compileoptions-)
  - [extractSync(rendered, { compileOptions })](#extractsyncrendered--compileoptions-)
- [What is sass-vars?](#what-is-sass-vars)
- [Requirements](#requirements)
- [Contributing](#contributing)
      - [Running tests](#running-tests)

## Installation
```
npm install --save node-sass sass-vars
```
*Note that the node-sass compiler have to be installed as it is a peer dependency of sass-vars.*

## API
The API is deliberately kept very similar to that of `node-sass`. This is because `sass-vars` can be used as a replacement that will add variable extraction as an additional feature to compiling the sass into css.

### render(compileOptions)

An augmented version of the `node-sass` render function that in addition to rendering css also extract sass variables into `rendered.vars`.

See [node-sass](https://github.com/sass/node-sass) for documentation of the compileOptions object.

To be able to extract variables across multiple files using the `@import` directive you need to provide either `file` or `includePaths` for import lookups.

```
const sassVars = require('sass-vars');

sassVars.render({
  file: 'path/to/my/styles.scss'
})
.then(rendered => {
  console.log(rendered.vars);
  console.log(rendere.css.toString());
});
```

### renderSync(compileOptions)

A synchronous version of the `render` function.

```
const sassVars = require('sass-vars');

const rendered = sassVars.render({
  file: 'path/to/my/styles.scss'
});

console.log(rendered.vars);
console.log(rendere.css.toString());
```

### extract(rendered, { compileOptions })

Extract variables for a rendered sass files.

See [node-sass](https://github.com/sass/node-sass) for documentation of the compileOptions object.

Generally you will pass the same compileOptions to both `node-sass` for rendering and **sass-vars** for extraction.

To be able to extract variables across multiple files using the `@import` directive you need to provide either `file` or `includePaths` for import lookups.

```
const sass = require('node-sass');
const sassVars = require('sass-vars');

const rendered = sass.renderSync({
  file: 'path/to/my/styles.scss'
});

sassVars.extract(rendered, {
  file: 'path/to/my/styles.scss'
})
.then(vars => {
  console.log(vars);
});
```

### extractSync(rendered, { compileOptions })

A synchronous version of the `extract` function.

```
const sass = require('node-sass');
const sassVars = require('sass-vars');

const rendered = sass.renderSync({
  file: 'path/to/my/styles.scss'
});

const vars = sassVars.extractSync(rendered, {
  file: 'path/to/my/styles.scss'
});

console.log(vars);
```


## What is sass-vars?

**sass-vars** is a tool that compiles sass style files into variables instead of css. This can be very useful when you need to style something that cannot be styled by css, or when you need to know details about the styles in your javascript.

It is built on [node-sass](https://github.com/sass/node-sass) which is using the performant [libsass](http://sass-lang.com/libsass) compiler. **sass-vars** is using native features in libsass in order to extract computed variables from your stylesheet that will be identical to the values in the generated css. This means you can expect to get the correct extracted value of a variable like `$myVariable: $multiplier * 200px / 10`, even if the `$multipler` variable is a variable defined in a separate imported sass file.

The purpose of this library is to give you the option to keep all of your style information in style files as expected. Maybe you are rendering on a canvas and cannot use css for styling the content, then this library will help you out.

There are other solutions to the same problem such as placing some of your style variables in a JSON file an including them into the sass, but with **sass-vars** you can skip that additional complexity of separate files and preprocessing and just get the variables directly from the sass itself.

## Requirements
- `node-sass >= 3.0.0`
- `node >= 4`

## Contributing

##### Running tests

```
npm test
```

