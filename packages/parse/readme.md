# @exifer/parse [![npm](https://img.shields.io/npm/v/@exifer/parse.svg)](https://npmjs.org/package/@exifer/parse)

> Utitlity to transform exif data into a meaningful human readable format. Not limited to [exifer][exifer]!


## Install

```
$ npm install --save @exifer/parse
```

This module exposes three module definitions:

* **ES Module**: `dist/exif-parse.mjs`
* **UMD**: `dist/exif-parse.umd.js`
* **CommonJS**: `dist/exif-parse.js`

The script can also be directly included from [unpkg.com](https://unpkg.com):
```html
<script src="https://unpkg.com/@exifer/parse"></script>
```


## Usage

```js
import { Orientation, Contrast } from '@exifer/parse';

Orientation(8);
// ~> { rotation: 270, flipped: false },

Contrast(1);
// ~> `Soft`
```

Used directly with exif meta-data reader [exifer](exifer)
```js
import exifer from 'exifer';
import * as parse from '@exifer/parse';

const metadata = await exifer(img, { parse });
// {
//   Orientation: { rotation: 270, flipped: false },
//   SceneCaptureType: `Landscape`,
//   Contrast: `Soft`,
//   MeteringMode: `MultiSpot`
//   ...
// }
```

## API

Export an object of parsers for most Exif tags.
The parser name correspond to the Exif tag name.

If a value cannot be parsed it will be returned as is.

> [Exif Tags Reference](https://www.awaresystems.be/imaging/tiff/tifftags/privateifd.html)


### ColorSpace(value)
Returns: `String`

#### value
Type: `Number`


### GPSSpeed(value)
Returns: `String`

#### value
Type: `Number`


### GPSVersionID(value)
Returns: `String`

#### value
Type: `Number`


### GPSDateStamp(value)
Returns: `String`

#### value
Type: `String`


### GPSTimeStamp(value)
Returns: `String`

#### value
Type: `String`


### GPSTimeStamp(value)
Returns: `String`

#### value
Type: `String`


### DateTimeOriginal(value)
Returns: `String`

#### value
Type: `String`


### DateTimeDigitized(value)
Returns: `String`

#### value
Type: `String`


### ModifyDate(value)
Returns: `String`

#### value
Type: `String`


### ExifVersion(value)
Returns: `String`

#### value
Type: `Array`


### Orientation(value)
Returns: `Object`

#### value
Type: `Number`


### ExposureProgram(value)
Returns: `String`

#### value
Type: `Number`


### MeteringMode(value)
Returns: `String`

#### value
Type: `Number`


### LightSource(value)
Returns: `String`

#### value
Type: `Number`


### Flash(value)
Returns: `String`

#### value
Type: `Number`


### SensingMethod(value)
Returns: `String`

#### value
Type: `Number`


### SceneCaptureType(value)
Returns: `String`

#### value
Type: `Number`


### SceneType(value)
Returns: `String`

#### value
Type: `Number`


### CustomRendered(value)
Returns: `String`

#### value
Type: `Number`


### WhiteBalance(value)
Returns: `String`

#### value
Type: `Number`


### GainControl(value)
Returns: `String`

#### value
Type: `Number`


### Contrast(value)
Returns: `String`

#### value
Type: `Number`


### Saturation(value)
Returns: `String`

#### value
Type: `Number`


### Sharpness(value)
Returns: `String`

#### value
Type: `Number`


### SubjectDistanceRange(value)
Returns: `String`

#### value
Type: `Number`


### FileSource(value)
Returns: `String`

#### value
Type: `Number`


### Components(value)
Returns: `String`

#### value
Type: `Number`


## License

MIT © [Terkel Gjervig](https://terkel.com)

[exifer]: https://github.com/terkelg/exifer
[tags]: https://github.com/terkelg/exifer/tree/master/packages/tags
