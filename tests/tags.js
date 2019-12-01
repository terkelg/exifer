import * as tags from '../packages/tags/src/index.js';
import test from 'tape';

test(`exports`, t => {
  t.is(typeof tags, `object`, `~> an object`);
  t.is(typeof tags.exif, `object`, `~> exif is an object`);
  t.is(typeof tags.gps, `object`, `~> gps is an object`);
  t.end();
});

test(`exports :: exif properties`, t => {
	t.is(Object.keys(tags.exif).length, 429);
  t.end();
});

test(`exports :: gps properties`, t => {
	t.is(Object.keys(tags.gps).length, 32);
  t.end();
});
