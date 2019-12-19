# @exifer/exif [![npm](https://img.shields.io/npm/v/@exifer/exif.svg)](https://npmjs.org/package/@exifer/exif)

> Tags and parsers for exif meta-data.


## Install

```
$ npm install --save @exifer/exif
```

This module exposes three module definitions:

* **ES Module**: `dist/exifer-exif.mjs`
* **UMD**: `dist/exifer-exif.umd.js`
* **CommonJS**: `dist/exifer-exif.js`

The script can also be directly included from [unpkg.com](https://unpkg.com):
```html
<script src="https://unpkg.com/@exifer/exif"></script>
```

## Usage

```js
import exifer from 'exifer';
import exif from '@exifer/exif';

// Pass tag/parser map to Exifer
const metadata = await exifer(img, {
    tags: { exif }
});
```


## License

MIT © [Terkel Gjervig](https://terkel.com)