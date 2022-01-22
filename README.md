# Prntr (Printer)

![Github Build Status](https://github.com/daphnesmit/prntr/actions/workflows/release.yml/badge.svg)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](LICENSE)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm](https://img.shields.io/npm/v/prntr.svg)](https://www.npmjs.com/package/prntr)

A tiny javascript library to help printing from the web.

[Print.js](https://github.com/crabbly/print.js) but modern and maintained.

*This is a fork of Print.js but transformed into a Typescript package.*


🙏 Thank you [Rodrigo](https://github.com/crabbly) for all your hard work!

<!-- TODO: Netlify example site -->

## Installation

You can download the latest version of Prntr from [NPM](https://www.npmjs.com/package/prntr)

To install via npm:

```bash
yarn add prntr --save
```

To install via yarn:

```bash
yarn add prntr
```

Import the library into your project:

```js
import prntr from 'prntr'
```

## Documentation

TODO
<!-- Insert netlify site-->

## Contributing to Prntr

Contributions to Prntr are greatly welcomed and encouraged.

##### Using issues

The [issue tracker](https://github.com/daphnesmit/prntr/issues) is the preferred channel for reporting bugs, requesting new features and submitting pull requests.

Keep in mind that we would like to keep this a lightweight library.

Please do not use the issues channel for support requests. For help with using Prntr Please ask questions on Stack Overflow and use the tag `prntr`.

##### Reporting bugs

Well structured, detailed bug reports are hugely valuable for the project.

* Check the issue search to see if it has already been reported.
* Isolate the problem to a simple test case.
* Create a codepen or codesandbox or similar online example replicating the issue.

Please provide any additional details associated with the bug.

##### Pull requests

Clear, concise pull requests are excellent at continuing the project's community driven growth.  

Please make your commits in logical sections with clear commit messages.  

##### Start developing using the example

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

##### Tests

The library is written following the [Javascript Standard](https://standardjs.com) code style. When running tests, we will also test for any style issues or warnings using Eslint..

##### Building
This package is using [preconstruct](https://preconstruct.tools/) to build our code painlessly with a zero config script.

##### Releasing
This package is using [changesets](https://github.com/changesets/changesets) to release the right package versions.

## License

Prntr is available under the [MIT license](https://github.com/daphnesmit/prntr/blob/master/LICENSE).
