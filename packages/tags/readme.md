# @exifer/tags [![npm](https://img.shields.io/npm/v/@exifer/tags.svg)](https://npmjs.org/package/@exifer/tags)

> List of the most common exif meta-data tags.


## Install

```
$ npm install --save @exifer/tags
```

This module exposes three module definitions:

* **ES Module**: `dist/exif-tags.mjs`
* **UMD**: `dist/exif-tags.umd.js`
* **CommonJS**: `dist/exif-tags.js`

The script can also be directly included from [unpkg.com](https://unpkg.com):
```html
<script src="https://unpkg.com/@exifer/tags"></script>
```

## Usage

```js
import exifer from 'exifer';
import tags from '@exifer/tags';

// Pass all tags to exif to read
const metadata = await exifer(img, { gps: tags.gps, exif: tags.exif });
```

## API

### tags
Type: `Object`


#### exif
Type: `Object`

Map with exif tags.


#### gps
Type: `Object`

Map with exif gps tags.


## License

MIT © [Terkel Gjervig](https://terkel.com)

[exifer]: https://github.com/terkelg/exifer
[parse]: https://github.com/terkelg/exifer/tree/master/packages/parse
