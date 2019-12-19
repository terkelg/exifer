import {iterateAppMarkers} from './markers.js';
import {parseIptc} from './parsers/iptc.js';
import {parseExif} from './parsers/exif.js';
import {parseXmp} from './parsers/xmp.js';

const parsers = {
	tiff: parseExif,
	iptc: parseIptc,
	xmp: parseXmp
};

/**
 * @see https://www.exif.org/Exif2-2.PDF
 * @see https://dev.exiv2.org/projects/exiv2/wiki/The_Metadata_in_JPEG_files
 * @see https://exiftool.org/index.html
 */
export default async function exifer(input, opts = {}) {
	let view = await prepareDataView(input);
	let tags = {};
	for (const {type, offset} of iterateAppMarkers(view)) {
		if (opts[`skip${type}`]) continue;
		Object.assign(tags, parsers[type](view, offset, opts.tags));
	}
	return tags;
}

async function prepareDataView(input) {
	let arrayBuffer;
	if (typeof File !== `undefined` && input instanceof File) {
		arrayBuffer = await readFile(input);
	} else if (typeof Buffer !== `undefined` && input instanceof Buffer) {
		arrayBuffer = input.buffer;
	} else {
		arrayBuffer = input;
	}
	return new DataView(arrayBuffer);
}

async function readFile(file) {
	const arrayBuffer = await new Promise(resolve => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.readAsArrayBuffer(file);
	});
	return arrayBuffer;
}
