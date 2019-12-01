# @exifer/parse [![npm](https://img.shields.io/npm/v/@exifer/parse.svg)](https://npmjs.org/package/@exifer/parse)

> Utitlity to transform exif data into meaningful human readable values. Not limited [exifer][exifer]!


## Install

```
$ npm install --save @exifer/parse
```

## Usage

```js
import exifer from 'exifer';
import parse from '@exifer/parse';

const tags = {
	Orientation: 8,
	SceneCaptureType: 1,
	Contrast: 1,
	MeteringMode: 4
}

const parsed = parse(tags);
// {
//   Orientation: { rotation: 270, flipped: false },
//   SceneCaptureType: `Landscape`,
//   Contrast: `gSoft`,
//   MeteringMode: `gMultiSpot`
// }


// used directly with exifer
const metadata = await exifer(img, { parse });
```

## API

### parse(tags)

#### tags
Type: `Object`

Hash map with exif values to transform.

> **Important:** property names must match their exif tag name.


## License

MIT © [Terkel Gjervig](https://terkel.com)

[exifer]: https://github.com/terkelg/exifer
[tags]: https://github.com/terkelg/exifer/tree/master/packages/tags
