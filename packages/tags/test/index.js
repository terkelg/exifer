import exifer from '../src/index.js';
import { join, dirname } from 'path';
import fs from 'fs';
import test from 'tape';

const moduleURL = new URL(import.meta.url);
const fixtures = join(dirname(moduleURL.pathname), `fixtures`);

test(`exports`, t => {
  t.is(typeof exifer, `function`, `~> a function`);
  t.end();
});

test(`read :: buffer`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `a.jpg`));
	const x = await exifer(buffer);
  t.is(typeof x, `object`);
  t.is(x.Make, `Apple`);
  t.is(x.Model, `iPhone X`);
  t.is(x.Software, `12.4`);
  t.is(x.Flash, 16);
  t.is(x.PixelXDimension, 4032);
  t.is(x.PixelYDimension, 3024);
  t.end();
});

test(`read :: ArrayBuffer`, async t => {
	const buffer = fs.readFileSync(join(fixtures, `a.jpg`));
	const arrayBuffer = new ArrayBuffer(buffer.byteLength);
	const view = new DataView(arrayBuffer);
	buffer.forEach((value, index) => view.setUint8(index, value));
	const x = await exifer(arrayBuffer);
  t.is(typeof x, `object`);
  t.is(x.Make, `Apple`);
  t.is(x.Model, `iPhone X`);
  t.is(x.Software, `12.4`);
  t.is(x.Flash, 16);
  t.is(x.PixelXDimension, 4032);
  t.is(x.PixelYDimension, 3024);
  t.end();
});

test(`read :: image without Exif`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `b.jpg`));
		await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Segment not found`);
	}
	t.end();
});

test(`read :: non-JPEG image`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `b.png`));
		await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Invalid JPEG`);
	}
	t.end();
});

test(`read :: empty file`, async t => {
	try {
		const buffer = fs.readFileSync(join(fixtures, `empty.txt`));
		await exifer(buffer);
	} catch (e) {
		t.is(e instanceof Error, true);
		t.is(e.message, `Invalid JPEG`);
	}
	t.end();
});
