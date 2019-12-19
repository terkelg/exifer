# @exifer/iptc [![npm](https://img.shields.io/npm/v/@exifer/iptc.svg)](https://npmjs.org/package/@exifer/iptc)

> Tags and parsers for IPTC meta-data.


## Install

```
$ npm install --save @exifer/iptc
```

This module exposes three module definitions:

* **ES Module**: `dist/exifer-iptc.mjs`
* **UMD**: `dist/exifer-iptc.umd.js`
* **CommonJS**: `dist/exifer-iptc.js`

The script can also be directly included from [unpkg.com](https://unpkg.com):
```html
<script src="https://unpkg.com/@exifer/iptc"></script>
```

## Usage

```js
import exifer from 'exifer';
import iptc from '@exifer/iptc';

// Pass tag/parser map to Exifer
const metadata = await exifer(img, {
    tags: { iptc }
});
```


## License

MIT © [Terkel Gjervig](https://terkel.com)