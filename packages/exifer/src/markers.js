import {viewToString} from './types.js';

/**
 * This file is heavly based on ExifReader,
 * but simplified and with minor modifications:
 * https://github.com/mattiasw/ExifReader/blob/master/src/image-header.js
 */

const MIN_TIFF_DATA_BUFFER_LENGTH = 4;
const MIN_JPEG_DATA_BUFFER_LENGTH = 2;
const TIFF_ID = 0x2a;
const TIFF_ID_OFFSET = 2;
const TIFF_FILE_HEADER_OFFSET = 0;
const JPEG_ID = 0xffd8; // JPEG magic bytes header
const JPEG_ID_SIZE = 2;
const LITTLE_ENDIAN = 0x4949;
const APP_ID_OFFSET = 4;
const APP_MARKER_SIZE = 2;
const TIFF_HEADER_OFFSET = 10; // From start of APP1 marker.
const IPTC_DATA_OFFSET = 18; // From start of APP13 marker.
const XMP_DATA_OFFSET = 33; // From start of APP1 marker.
const XMP_EXTENDED_DATA_OFFSET = 79; // From start of APP1 marker including GUID, total length, and offset.

const SOF0_MARKER = 0xffc0;
const SOF2_MARKER = 0xffc2;
const DHT_MARKER = 0xffc4;
const DQT_MARKER = 0xffdb;
const DRI_MARKER = 0xffdd;
const SOS_MARKER = 0xffda;

const APP0_MARKER = 0xffe0;
const APP1_MARKER = 0xffe1;
const APP13_MARKER = 0xffed;
const APP15_MARKER = 0xffef;
const COMMENT_MARKER = 0xfffe;

// 0x45786966 - "E", "X", "I", "F"
const APP1_EXIF_IDENTIFIER = `Exif`;

// 0x68747470 - "H", "T", "T", "P"
const APP1_XMP_IDENTIFIER = `http://ns.adobe.com/xap/1.0/\x00`;
const APP1_XMP_EXTENDED_IDENTIFIER = 'http://ns.adobe.com/xmp/extension/\x00';
const APP13_IPTC_IDENTIFIER = `Photoshop 3.0`;

const hasTiffMarker = view => {
	const littleEndian = view.getUint16(0) === LITTLE_ENDIAN;
	return view.getUint16(TIFF_ID_OFFSET, littleEndian) === TIFF_ID;
};

const isTiffFile = view => view.byteLength >= MIN_TIFF_DATA_BUFFER_LENGTH && hasTiffMarker(view);

const isJpegFile = view => view.byteLength >= MIN_JPEG_DATA_BUFFER_LENGTH && view.getUint16(0, false) === JPEG_ID;

export function* iterateAppMarkers(view) {
	let appMarkerPosition = JPEG_ID_SIZE;
	let xmpChunks = [];
	let fieldLength;

	if (isTiffFile(view)) return yield {type: `tiff`, offset: TIFF_FILE_HEADER_OFFSET};

	if (!isJpegFile(view)) throw new Error(`Invalid image format`);

	while (appMarkerPosition + APP_ID_OFFSET + 5 <= view.byteLength) {
		if (isApp1ExifMarker(view, appMarkerPosition)) {
			fieldLength = view.getUint16(appMarkerPosition + APP_MARKER_SIZE, false);
			let offset = appMarkerPosition + TIFF_HEADER_OFFSET;
			yield {type: `tiff`, offset};
		} else if (isApp1XmpMarker(view, appMarkerPosition)) {
			fieldLength = view.getUint16(appMarkerPosition + APP_MARKER_SIZE, false);
			xmpChunks.push(getXmpChunkDetails(appMarkerPosition, fieldLength));
		} else if (isApp1ExtendedXmpMarker(view, appMarkerPosition)) {
			fieldLength = view.getUint16(appMarkerPosition + APP_MARKER_SIZE, false);
			xmpChunks.push(getExtendedXmpChunkDetails(appMarkerPosition, fieldLength));
		} else if (isApp13PhotoshopMarker(view, appMarkerPosition)) {
			fieldLength = view.getUint16(appMarkerPosition + APP_MARKER_SIZE, false);
			let offset = appMarkerPosition + IPTC_DATA_OFFSET;
			yield {type: `iptc`, offset};
		} else if (isAppMarker(view, appMarkerPosition)) {
			fieldLength = view.getUint16(appMarkerPosition + APP_MARKER_SIZE, false);
		} else {
			break;
		}
		appMarkerPosition += APP_MARKER_SIZE + fieldLength;
	}

	if (xmpChunks.length) yield {type: `xmp`, offset: xmpChunks};
}

function isApp1ExifMarker(view, appMarkerPosition) {
	const markerIdLength = APP1_EXIF_IDENTIFIER.length;
	return (
		view.getUint16(appMarkerPosition, false) === APP1_MARKER &&
		viewToString(view, appMarkerPosition + APP_ID_OFFSET, markerIdLength) === APP1_EXIF_IDENTIFIER &&
		view.getUint8(appMarkerPosition + APP_ID_OFFSET + markerIdLength, false) === 0x00
	);
}

function isApp1XmpMarker(view, appMarkerPosition) {
	return view.getUint16(appMarkerPosition, false) === APP1_MARKER && isXmpIdentifier(view, appMarkerPosition);
}

function isXmpIdentifier(view, appMarkerPosition) {
	const markerIdLength = APP1_XMP_IDENTIFIER.length;
	return viewToString(view, appMarkerPosition + APP_ID_OFFSET, markerIdLength) === APP1_XMP_IDENTIFIER;
}

function isApp1ExtendedXmpMarker(view, appMarkerPosition) {
	return view.getUint16(appMarkerPosition, false) === APP1_MARKER && isExtendedXmpIdentifier(view, appMarkerPosition);
}

function isExtendedXmpIdentifier(view, appMarkerPosition) {
	const markerIdLength = APP1_XMP_EXTENDED_IDENTIFIER.length;
	return viewToString(view, appMarkerPosition + APP_ID_OFFSET, markerIdLength) === APP1_XMP_EXTENDED_IDENTIFIER;
}

function getXmpChunkDetails(appMarkerPosition, fieldLength) {
	return {
		dataOffset: appMarkerPosition + XMP_DATA_OFFSET,
		length: fieldLength - (XMP_DATA_OFFSET - APP_MARKER_SIZE)
	};
}

function getExtendedXmpChunkDetails(appMarkerPosition, fieldLength) {
	return {
		dataOffset: appMarkerPosition + XMP_EXTENDED_DATA_OFFSET,
		length: fieldLength - (XMP_EXTENDED_DATA_OFFSET - APP_MARKER_SIZE)
	};
}

function isApp13PhotoshopMarker(view, appMarkerPosition) {
	const markerIdLength = APP13_IPTC_IDENTIFIER.length;
	return (
		view.getUint16(appMarkerPosition, false) === APP13_MARKER &&
		viewToString(view, appMarkerPosition + APP_ID_OFFSET, markerIdLength) === APP13_IPTC_IDENTIFIER &&
		view.getUint8(appMarkerPosition + APP_ID_OFFSET + markerIdLength, false) === 0x00
	);
}

function isAppMarker(view, appMarkerPosition) {
	const appMarker = view.getUint16(appMarkerPosition, false);
	return (
		(appMarker >= APP0_MARKER && appMarker <= APP15_MARKER) ||
		appMarker === COMMENT_MARKER ||
		appMarker === SOF0_MARKER ||
		appMarker === SOF2_MARKER ||
		appMarker === DHT_MARKER ||
		appMarker === DQT_MARKER ||
		appMarker === DRI_MARKER ||
		appMarker === SOS_MARKER
	);
}
