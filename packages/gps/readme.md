# @exifer/gps [![npm](https://img.shields.io/npm/v/@exifer/gps.svg)](https://npmjs.org/package/@exifer/gps)

> Tags and parsers for gps meta-data.


## Install

```
$ npm install --save @exifer/gps
```

This module exposes three module definitions:

* **ES Module**: `dist/exifer-gps.mjs`
* **UMD**: `dist/exifer-gps.umd.js`
* **CommonJS**: `dist/exifer-gps.js`

The script can also be directly included from [unpkg.com](https://unpkg.com):
```html
<script src="https://unpkg.com/@exifer/gps"></script>
```

## Usage

```js
import exifer from 'exifer';
import gps from '@exifer/gps';

// Pass tag/parser map to Exifer
const metadata = await exifer(img, {
    tags: { gps }
});
```


## License

MIT © [Terkel Gjervig](https://terkel.com)