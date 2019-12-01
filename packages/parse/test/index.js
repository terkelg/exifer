import * as parse from '../src/index.js';
import test from 'tape';

const props = [
	'Orientation',
	'ColorSpace',
	'GPSVersionID',
	'GPSDateStamp',
	'GPSTimeStamp',
	'DateTimeOriginal',
	'DateTimeDigitized',
	'ModifyDate',
	'ExifVersion',
	'Orientation',
	'ExposureProgram',
	'MeteringMode',
	'LightSource',
	'Flash',
	'SensingMethod',
	'SceneCaptureType',
	'SceneCaptureType',
	'SceneType',
	'CustomRendered',
	'WhiteBalance',
	'GainControl',
	'Contrast',
	'Saturation',
	'Sharpness',
	'SubjectDistanceRange',
	'FileSource',
	'Components'
]

test(`exports`, t => {
  t.is(typeof parse, `object`, `~> an object`);
  t.end();
});

test(`exports :: properties`, t => {
	t.is(Object.keys(props).length, props.length);
	props.forEach(prop => t.is(prop in parse, true));
  t.end();
});

test(`parse :: no parser found, echo value`, t => {
	t.is(parse.ColorSpace(0), 0);
	t.is(parse.MeteringMode(100), 100);
  t.end();
});

test(`parse :: generic`, t => {
	t.is(parse.MeteringMode(0), `Unknown`);
	t.is(parse.MeteringMode(4), `MultiSpot`);
	t.is(parse.MeteringMode(255), `Other`);
	t.is(parse.ExposureProgram(1), `Manual`);
	t.is(parse.Flash(0x0000), `Flash did not fire`);
	t.is(parse.Flash(0x0020), `No flash function`);
	t.is(parse.LightSource(10), `Cloudy weather`);
	t.is(parse.SceneCaptureType(2), `Portrait`);
  t.end();
});

test(`parse :: color`, t => {
	t.is(parse.ColorSpace(1), 'sRGB');
	t.is(parse.ColorSpace(65535), 'Uncalibrated');
  t.end();
});

test(`parse :: string`, t => {
	t.is(parse.ExifVersion([48, 50, 50, 48]), '0220');
  t.end();
});

test(`parse :: gps`, t => {
	t.is(parse.GPSVersionID([2, 1, 0, 0]), `2.1.0.0`);
  t.end();
});

test(`parse :: orientation`, t => {
	let parser = parse.Orientation;
	t.deepEqual(parser(1), { rotation: 0, flipped: false });
	t.deepEqual(parser(6), { rotation: 90, flipped: false });
	t.deepEqual(parser(3), { rotation: 180, flipped: false });
	t.deepEqual(parser(8), { rotation: 270, flipped: false });
	t.deepEqual(parser(2), { rotation: 0, flipped: false });
	t.deepEqual(parser(5), { rotation: 90, flipped: true });
	t.deepEqual(parser(4), { rotation: 180, flipped: false });
	t.deepEqual(parser(7), { rotation: 270, flipped: false });
  t.end();
});

test(`parse :: date`, t => {
	let parser = parse.DateTimeDigitized;
	let str = `2019:08:25 15:07:02`;
	let date = new Date(Date.UTC(2019, 7, 25, 15, 7, 2));
	t.is(parser(str).toISOString(), date.toISOString());
  t.end();
});
