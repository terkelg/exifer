<p align="center">
  <img src="https://github.com/terkelg/exifer/raw/master/exifer.png" alt="exifer" width="200" />
</p>

<p align="center">
  <a href="https://npmjs.org/package/exifer">
    <img src="https://badgen.now.sh/npm/v/exifer" alt="version" />
  </a>
  <a href="https://github.com/terkelg/exifer/actions">
    <img src="https://badgen.now.sh/github/status/terkelg/exifer" alt="build status" />
  </a>
  <a href="https://codecov.io/gh/terkelg/exifer">
    <img src="https://badgen.now.sh/codecov/c/github/terkelg/exifer" alt="codecov" />
  </a>
  <a href="https://unpkg.com/exifer">
    <img src="http://img.badgesize.io/https://unpkg.com/exifer/dist/exifer.mjs?compression=gzip" alt="gzip size" />
  </a>
</p>

<p align="center">
  <b>A lightweight exif image meta-data decipher</b><br>
  Exifer is a small module that read JPEG/TIFF meta-data.
</p>

Exif tags/fields are used to encode additional information into images taken by digital still cameras. The exif meta information is organized into different Image File Directories (IFD's) within the image. It contains useful information like image rotation, GPS coordinates, times stamps. ISO, etc.

> Learn more about [exif](https://en.wikipedia.org/wiki/Exif) tags


## Features

- 📦 **Lightweight**: Small with zero Dependencies
- 🔍 **Extract** Exif, GPS, XMP and IPTC
- 📷 **Files**: Support both JPEG and TIFF files
- 📚 **Add-ons**: Extra tags and parsers [available](#add-ons)
- ♻️ **Isomorphic**: Works in node.js and the browser

This module exposes three module definitions:

* **ES Module**: `dist/exifer.mjs`
* **UMD**: `dist/exifer.umd.js`
* **CommonJS**: `dist/exifer.js`

## Install

```
$ npm install exifer
```

The script can also be directly included from [unpkg.com](https://unpkg.com):
```html
<script src="https://unpkg.com/exifer"></script>
```


## Usage

```js
import exifer from 'exifer'
import fs from 'fs';

const buffer = fs.readFileSync('photo.jpg');;
const tags = await exifer(buffer);
// {
//   Make: 'Apple',
//   Model: 'iPhone X',
//   Orientation: 6,
//   Software: '12.4',
//   ModifyDate: '2019:08:25 15:07:02',
//   ... and so on
// }
```


## API

### exifer(input, [opts])
Returns: `object` <_Promise_>

Takes a JPEG or JIFF image as input and returns an object with extracted meta-data. A `Promise` is returned that resolves to an hash-map of tag/value pairs.

Exifer only reads the most essential tags out of the box – which should cover 99% of all use cases. Tags are by default interpreted as ASCII strings.

To read or parse more tags chekcout [`opts.tags`](#optstags).


#### input
Type: `Buffer|ArrayBuffer|File`

Example running in the browser reading a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) ([`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)):

```js
import exifer from 'exifer';

/**
 * Assume 'input' is the value coming from an input field:
 * <input type="file" accept="image/*" id="input" >
 */

const input = document.getElementById('#input').files[0];
const tags = await exifer(input);
```

Example running in node.js reading a JPEG [`Buffer`](https://nodejs.org/api/buffer.html):

```js
import exifer from 'exifer';
import fs from 'fs';

const buffer = fs.readFileSync('photo.jpg');;
const tags = await exifer(buffer);
```

#### opts.tags
Type: `object`<br>

Exifer does not extract more than the most essential tags.

You can extract additional tags, or overwrite the [default tags](packages/exifer/src/tags.js), if you want to read more tags or write custom parsers. You can do this by passing [`tag objects`](#tag) to either `tags.exif`, `tags.gps` and/or `tags.iptc`.

The key for additional IFD image tags is the IFD field code in hexadecimal notation. The value is a [tag object](#tag) with at least a `name` property.

Here's an example where two custom gps [tag objects](#tags) passed as `tags.gps`:

```js
import exifer from 'exifer';
import fs from 'fs';

// try to read more GPS tags and parse timestamp
const gps = {
  0x0001: {name: 'GPSLatitudeRef'},
  0x0007: {name: 'GPSTimeStamp', parse: x => {
    return new Date(Date.UTC(1970, 0, 1, x[0], x[1], x[2]));
  }}
}

const buffer = fs.readFileSync('photo.jpg');
const parsed = await exifer(buffer, {tags: { gps }});
// {
//    ...
//    GPSLatitudeRef: 'N',
//    GPSTimeStamp: 1970-01-01T19:06:58.000Z
//    ...
// }
```


##### opts.tags.exif
Type: `object`<br>
default: `{}`

Hash-map with additonal exif tags.

> **OBS:** Find list of exif tags [here](https://exiftool.org/TagNames/EXIF.html)


##### opts.tags.iptc
Type: `object`<br>
default: `{}`

Hash-map with additonal IPTC tags.

> **OBS:** Find list of IPTC tags [here](https://exiftool.org/TagNames/IPTC.html)


##### opts.tags.gps
Type: `object`<br>
default: `{}`

Hash-map with additonal GPS tags.

> **OBS:** Find list of exif tags [here](https://exiftool.org/TagNames/GPS.html)


##### Add-ons

If you want to read all tags the following exifer add-on packages have you covered:

- **[@exifer/exif](packages/exif)**: Read and parse all Exif tags
- **[@exifer/gps](packages/gps)**: Read and parse all GPS tags
- **[@exifer/iptc](packages/iptc)**: Read and parse all IPTC tags

To read and parse all exif and tiff tags using add-ons, you simply import and pass them to the corresponding tags option:

```js
import exifer from 'exifer';
import iptc from '@exifer/iptc';
import exif from '@exifer/exif';
import fs from 'fs';

const buffer = fs.readFileSync('photo.jpg');
const parsed = await exifer(buffer, {tags: { exif, iptc }});
```


#### options.skipexif
Type: `boolean`<br>
Default: `false`

Skip exif tags.


#### options.skipiptc
Type: `boolean`<br>
Default: `false`

Skip IPTC tags.


#### options.skipxmp
Type: `boolean`<br>
Default: `false`

Skip XMP tags.



### Tag
Type: `Object`

Exifer only comes with a [few built-in tags](packages/exifer/src/tags.js). None of the default [tag objects](#tag) have parsers associated with them.

Example with a rather useless parser:
```js
{name: 'ModifyDate', raw: false, parse: x => `date is ${x}`}
```

#### tag.name
Type: `String`<br>

Required tag name. This is used as the key in the returned result object from [exifer](packages/exifer).

>**OBS:** name is the only required porperty.


#### tag.raw
Type: `Boolean`<br>
Default: `false`

By default all tags are interpreted as ASCII strings.
Set `raw` to `true` to get the raw tag value.


#### tag.parse
Type: `Function`<br>

Custom parser function. Use this to transform tag values.
Input is a ASCII string unless `raw` is `true`.

The returned output is used in the final result object returned by [exifer](packages/exifer).


## Credit

Inspired by [exif-orientation](https://github.com/ginpei/exif-orientation) and [ExifReader](https://github.com/mattiasw/ExifReader).

## License

MIT © [Terkel Gjervig](https://terkel.com)
