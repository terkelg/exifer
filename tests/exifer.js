import exifer from '../packages/exifer/src/index.js';
import {join, dirname} from 'path';
import jsdom from 'jsdom';
import test from 'tape';
import fs from 'fs';

import allExif from '../packages/exif/src/index.js';
import allGps from '../packages/gps/src/index.js';
import allIptc from '../packages/iptc/src/index.js';

const moduleURL = new URL(import.meta.url);
const fixtures = join(dirname(moduleURL.pathname), `fixtures`);

const {JSDOM} = jsdom;
const dom = new JSDOM();
const File = dom.window.File;

global.File = File;
global.FileReader = dom.window.FileReader;

test(`exports`, t => {
	t.is(typeof exifer, `function`, `~> a function`);
	t.end();
});

test(`read :: Buffer`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	const x = await exifer(buffer);
	t.is(typeof x, `object`);
	t.is(x.Make, `Apple`);
	t.is(x.Model, `iPhone X`);
	t.is(x.Software, `12.4`);
	t.end();
});

test(`read :: Partial buffer`, async t => {
	const full = fs.readFileSync(join(fixtures, `photo.jpg`));
	const slice = full.buffer.slice(0, 0.5 * 1024 * 1024);
	const x = await exifer(slice);
	t.is(typeof x, `object`);
	t.is(x.Make, `Apple`);
	t.is(x.Model, `iPhone X`);
	t.is(x.Software, `12.4`);
	t.end();
});

test(`read :: ArrayBuffer`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	const arrayBuffer = new ArrayBuffer(buffer.byteLength);
	const view = new DataView(arrayBuffer);
	buffer.forEach((value, index) => view.setUint8(index, value));
	const x = await exifer(arrayBuffer);
	t.is(typeof x, `object`);
	t.is(x.Make, `Apple`);
	t.is(x.Model, `iPhone X`);
	t.is(x.Software, `12.4`);
	t.end();
});

test(`read :: File`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	const arrayBuffer = new ArrayBuffer(buffer.byteLength);
	const view = new DataView(arrayBuffer);
	buffer.forEach((value, index) => view.setUint8(index, value));
	const file = new File([new Int8Array(buffer)], 'photo.jpg', {type: `image/jpeg`});
	const x = await exifer(file);
	t.is(typeof x, `object`);
	t.is(x.Make, `Apple`);
	t.is(x.Model, `iPhone X`);
	t.is(x.Software, `12.4`);
	t.end();
});

test(`read :: TIFF`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.tif`));
	const x = await exifer(buffer);
	t.is(x.Make, `Canon`);
	t.is(x.Model, `Canon 110E`);
	t.end();
});

test(`read :: TIFF with empty exif`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `empty.tif`));
	const x = await exifer(buffer);
	t.deepEqual(x, {});
	t.end();
});

test(`read :: JPEG with empty exif`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `empty.jpg`));
	const x = await exifer(buffer);
	t.deepEqual(x, {});
	t.end();
});

test(`read :: JPEG without exif`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `missing-exif.jpg`));
		await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Segment not found`);
	}
	t.end();
});

test(`read :: non-JPEG image`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `photo.png`));
		await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Invalid image format`);
	}
	t.end();
});

test(`read :: empty file`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `empty.txt`));
		await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Invalid image format`);
	}
	t.end();
});

test(`read :: minimal broken TIFF`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `tiny.tif`));
		const x = await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Invalid image format`);
	}
	t.end();
});

test(`read :: minimal broken JPEG`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `tiny.jpg`));
		const x = await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Invalid image format`);
	}
	t.end();
});

test(`options :: skip`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	let x = await exifer(buffer, {skipxmp: false});
	t.is('xmp' in x, true);
	x = await exifer(buffer, {skipxmp: true});
	t.is('xmp' in x, false);
	t.end();
});

test(`options :: tags`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	const gps = {0x001d: {name: 'GPSDateStamp'}};
	const exif = {0x011d: {name: 'PageName'}};
	const iptc = {0x013c: {name: 'Priority'}};
	const x = await exifer(buffer, {tags: {gps, exif, iptc}});
	t.is(x.GPSDateStamp, `2019:08:25`);
	t.is(x.PageName, `Page Name`);
	t.is(x.Priority, '6');
	t.end();
});

test(`options :: tags :: parse`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	const exif = {0x010f: {name: 'Make', parse: x => `By ${x}`}};
	const iptc = {0x0250: {name: 'Byline', parse: x => `A ${x}`}};
	const gps = {0x0001: {name: 'GPSLatitudeRef', parse: x => `Ref: ${x}`}};
	const x = await exifer(buffer, {tags: {exif, iptc, gps}});
	t.is(x.Make, `By Apple`);
	t.is(x.Byline, `A By line`);
	t.is(x.GPSLatitudeRef, `Ref: N`);
	t.end();
});

test(`options :: tags :: raw`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	const exif = {0x010f: {name: 'Make', raw: true}};
	const iptc = {0x0250: {name: 'Byline', raw: true}};
	const gps = {0x0001: {name: 'GPSLatitudeRef', raw: true}};
	const x = await exifer(buffer, {tags: {exif, iptc, gps}});
	t.deepEqual(x.Make, [65, 112, 112, 108, 101, 0]);
	t.deepEqual(x.Byline, [66, 121, 32, 108, 105, 110, 101]);
	t.deepEqual(x.GPSLatitudeRef, [78, 0]);
	t.end();
});

test(`stress test`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `photo.jpg`));
	const x = await exifer(buffer, {tags: {exif: allExif, iptc: allIptc, gps: allGps}});
	t.is(x.GPSSpeed, 0);
	t.is(x.CameraSerialNumber, `12345678`);
	t.is(x.ResolutionUnit, `inches`);
	t.end();
});
