# Prntr (Printer)

![Github Build Status](https://github.com/daphnesmit/prntr/actions/workflows/release.yml/badge.svg)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?color=lightgrey)](LICENSE)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?color=yellow)](http://standardjs.com/)
[![npm](https://img.shields.io/npm/v/prntr.svg?color=red)](https://www.npmjs.com/package/prntr)
[![bundlephobia](https://img.shields.io/bundlephobia/minzip/prntr?color=success)](https://bundlephobia.com/package/prntr)

A tiny javascript library to help printing from the web.

[Print.js](https://github.com/crabbly/print.js) but modern and maintained.


*This is a fork of Print.js but transformed into a Typescript package.*

**Only 3.7kB gzipped!**

🙏 Thank you [Rodrigo](https://github.com/crabbly) for all your hard work!

<!-- TODO: Netlify example site -->

## Installation

You can download the latest version of Prntr from [NPM](https://www.npmjs.com/package/prntr)

To install via npm:

```bash
npm i prntr --save
```

To install via yarn:

```bash
yarn add prntr
```

## Usage
Import the library into your project:

```js
import prntr from 'prntr'
```

Or use the library directly in a script tag using the umd build and a CDN or such like this:
```js
<script src="https://cdn.jsdelivr.net/npm/prntr@2.0.11/dist/prntr.umd.min.js"></script>
```



## Browser Support

- Chrome: Latest 2 versions should work at least
- Firefox: Latest 2 versions should work at least. Firefox requires you to set 'open PDF in browser' setting to true in your browser settings to be able to print PDFs and such.
- Safari: Latest 2 versions should partially work. Safari 14/15 has issues with printing more than once. See [this issue](https://github.com/crabbly/Print.js/issues/528) on StackOverflow.
- Safari Mobile: Didn't check but who prints on iPad even these days. Actually who prints at all?!
- Edge: Latest 2 versions should work at least. Old EdgeHTML engine should also work. Maybe you need to transpile package though.
- IE11: I doubt it works in IE11. You probably need to transpile the package but I am not sure that will work. IE11 is really old and even Microsoft itself stopped supporting it.


Feel free to send pull requests to fix any browser issues!

## Documentation
Extensive examples can be found in the [/example](/example/index.html) html document.

First import the prnt function:


```js
import prntr from 'prntr'
```

This is not needed per se since prntr is also available on the window as `window.prntr`

### Print a PDF
To print a simple pdf:

```js
prntr({
  printable: '/path-to/document.pdf',
  type: 'pdf'
})
```
### Print HTML 
To print the contents of a HTML Element: 

```js
prntr({
  printable: 'elementId', // The id of the DOM Element
  type: 'html'
})
```
### Print Raw HTML 
To print an HTML string:

```js
prntr({
  printable: `<h1>Prntr Raw HTML Print Test</h1>
<p class="blue">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
<p>sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`,
  type: 'raw-html',
  style: 'h1 { color: red; } .blue { color:blue; }',
})
```

You can also add custom CSS:
```js
prntr({
  printable: 'elementId', // The id of the DOM Element
  type: 'html',
  css: '/path-to/customStyle.css',
  scanStyles: false,  // The library will not process styles applied to the html being printed
})
```

### Print JSON 
To print JSON content in a Table:

```js
const data = [
  {
    name: 'Daphne',
    age: 35,
    country: 'NL',
  },
  {
    name: 'Jessica',
    age: 30,
    country: 'NL',
  }
]

prntr({
  printable: data,
  properties: ['name', 'age'],
  type: 'json',
  gridStyle: 'border: 2px solid red;',
  gridHeaderStyle: 'color: red;  border: 2px solid green;',
})
```

### Print Image(s) 
To print a single image:

```js
prntr({
  printable: '/images/some-image-1.jpg',
  type: 'image',
})
```
To print multiple images:

```js
prntr({
  printable: [
    '/images/some-image-1.jpg',
    '/images/some-image-2.jpg'
  ],
  type: 'image',
  style: 'img { max-width: 50%; }',
})
```

<!-- Insert netlify site-->

## Contributing to Prntr

Contributions to Prntr are greatly welcomed and encouraged.

### Using issues

The [issue tracker](https://github.com/daphnesmit/prntr/issues) is the preferred channel for reporting bugs, requesting new features and submitting pull requests.

Keep in mind that we would like to keep this a lightweight library.

Please do not use the issues channel for support requests. For help with using Prntr Please ask questions on Stack Overflow and use the tag `prntr`.

### Reporting bugs

Well structured, detailed bug reports are hugely valuable for the project.

* Check the issue search to see if it has already been reported.
* Isolate the problem to a simple test case.
* Create a codepen or codesandbox or similar online example replicating the issue.

Please provide any additional details associated with the bug.

### Pull requests

Clear, concise pull requests are excellent at continuing the project's community driven growth.  

Please make your commits in logical sections with clear commit messages.  

### Start developing using the example

Open 2 terminal tabs.

In the first tab run:
```bash
yarn
yarn watch
```

In the second tab run:
```bash
yarn dev
```

Open up [http://localhost:3000/example/index.html](http://localhost:3000/example/index.html) in your browser!

### Tests

The library is written following the [Javascript Standard](https://standardjs.com) code style. When running tests, we will also test for any style issues or warnings using Eslint..

### Building
This package is using [preconstruct](https://preconstruct.tools/) to build our code painlessly with a zero config script.

### Releasing
This package is using [changesets](https://github.com/changesets/changesets) to release the right package versions.

## License

Prntr is available under the [MIT license](https://github.com/daphnesmit/prntr/blob/main/LICENSE).
