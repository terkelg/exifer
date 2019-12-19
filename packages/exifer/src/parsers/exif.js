import * as tags from '../tags.js';
import {getSize, SIZES, viewToValue, parseViewValue} from '../types.js';
import {IFD_GPS, IFD_INTEROP} from '../tags.js';

const TIFF_ENDIAN_ASSERTION = 0x002a;
const TIFF_ENDIAN_ASSERTION_OFFSET = 2;
const TIFF_BYTE_ORDER = 0;
const TIFF_IFD_OFFSET = 4;
const ORDER_LITTLE_ENDIAN = 0x4949; // "I", "I"

const FIELD_SIZE = 12;
const TAG_TYPE_OFFSET = getSize('short');
const TAG_COUNT_OFFSET = TAG_TYPE_OFFSET + getSize('short');
const TAG_VALUE_OFFSET = TAG_COUNT_OFFSET + getSize('long');

export function parseExif(view, tiffHeaderOffset, extraTags = {}) {
	const exif = {...tags.exif, ...extraTags.exif};
	const gps = {...tags.gps, ...extraTags.gps};
	const littleEndian = isLittleEndian(view, tiffHeaderOffset);
	const ifd0Position = findIfd0Position(view, tiffHeaderOffset, littleEndian);
	return parseTiffSegment(view, ifd0Position, tiffHeaderOffset, littleEndian, exif, gps);
}

function parseTiffSegment(view, ifdPosition, tiffHeaderOffset, littleEndian, exif, gps) {
	const ifd0 = readTags(view, exif, ifdPosition, tiffHeaderOffset, littleEndian);

	if (ifd0[IFD_GPS])
		Object.assign(ifd0, readTags(view, gps, tiffHeaderOffset + ifd0[IFD_GPS], tiffHeaderOffset, littleEndian));

	if (ifd0[IFD_INTEROP])
		Object.assign(ifd0, readTags(view, exif, tiffHeaderOffset + ifd0[IFD_INTEROP], tiffHeaderOffset, littleEndian));

	const entries = view.getUint16(ifdPosition, littleEndian);
	const ifd1Position = view.getUint32(ifdPosition + 2 + entries * FIELD_SIZE, littleEndian);
	if (ifdPosition !== 0)
		Object.assign(ifd0, readTags(view, exif, tiffHeaderOffset + ifd1Position, tiffHeaderOffset, littleEndian));

	return ifd0;
}

/**
 * IFD p. 20 - 4.6.2
 */
function readTags(view, tags, ifdPosition, tiffHeaderOffset, littleEndian) {
	const result = {};
	const fieldIterator = iterateIfdFields(view, ifdPosition, littleEndian);
	for (const offset of fieldIterator) {
		const tag = view.getUint16(offset, littleEndian);
		const type = view.getUint16(offset + TAG_TYPE_OFFSET, littleEndian);
		const count = view.getUint32(offset + TAG_COUNT_OFFSET, littleEndian);
		const state = {tag, type, count, offset, tiffHeaderOffset, littleEndian};
		const valueOffset = getValueOffset(view, state);
		if (!tags[tag] || !valueFitsInView(view, valueOffset, state)) continue;
		const value = viewToValue(view, {...state, offset: valueOffset});
		const {name, parse = x => x, raw} = tags[tag];
		result[name] = parse(raw ? value : parseViewValue(value, type));
	}
	return result;
}

/**
 * Check if tag value fits in offset slot
 */
function getValueOffset(view, state) {
	if (SIZES[state.type] * state.count <= getSize('long')) return state.offset + TAG_VALUE_OFFSET;
	return state.tiffHeaderOffset + view.getUint32(state.offset + TAG_VALUE_OFFSET, state.littleEndian);
}

function valueFitsInView(view, valueOffset, {tiffHeaderOffset, type, count}) {
	return tiffHeaderOffset + valueOffset + SIZES[type] * count <= view.byteLength;
}

/**
 * IFD p. 19 - 4.6.2
 * - num of IFD fields (short)
 * - IFD:
 *   - tag (short)
 *   - type (short)
 *   - count (long)
 *   - value offset (long)
 * - IFD...
 */
function* iterateIfdFields(view, ifdFieldOffset, littleEndian) {
	const numOfIfdFields = view.getUint16(ifdFieldOffset, littleEndian);
	const fieldLength = FIELD_SIZE;
	for (let i = 0; i < numOfIfdFields; i++) {
		const currentOffset = ifdFieldOffset + i * fieldLength + 2;
		yield currentOffset;
	}
}

/**
 * TIFF Header p.16
 * - byte order (short). `0x4949` = little = "II", `0x4d4d` = 'MM' = big
 * - 42 (short). `0x002a` fixed.
 * - offset of IFD (long). Minimum is `0x00000008` (8).
 */
function findIfd0Position(view, tiffHeaderOffset, littleEndian) {
	const endianAssertionValue = view.getUint16(tiffHeaderOffset + TIFF_ENDIAN_ASSERTION_OFFSET, littleEndian);
	if (endianAssertionValue !== TIFF_ENDIAN_ASSERTION)
		throw new Error(`Invalid JPEG format: littleEndian ${littleEndian}, assertion: 0x${endianAssertionValue}`);
	const ifdDistance = view.getUint32(tiffHeaderOffset + TIFF_IFD_OFFSET, littleEndian);
	return tiffHeaderOffset + ifdDistance;
}

/**
 * TIFF Header p.16
 * - expect `0x4949` little endian.
 */
function isLittleEndian(view, tiffHeaderOffset) {
	const endian = view.getUint16(tiffHeaderOffset + TIFF_BYTE_ORDER, false);
	return endian === ORDER_LITTLE_ENDIAN;
}
