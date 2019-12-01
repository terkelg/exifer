import * as read from './read';
import * as tags from './tags';
import * as consts from './constants';

/**
 * If the input is not JPEG file with Exif information,
 * it returns `undefined`.
 * @see http://www.cipa.jp/std/documents/j/DC-008-2012_J.pdf
 */
export default async function exifer(input, {parse = {}, exif = {}, gps = {}} = {}) {
	exif = {...exif, ...tags.exif};
	gps = {...gps, ...tags.gps};

  const view = await prepareDataView(input);

	if (!isValidJpeg(view)) throw new Error(`Invalid JPEG`);

  const segmentOffset = await findExifSegmentOffset(view);
	if (segmentOffset < 0) throw new Error(`Segment not found`);

  const tiffHeaderOffset = segmentOffset + consts.tiffHeader.fromSegment;
  const littleEndian = isLittleEndian(view, tiffHeaderOffset);
  const ifdPosition = findIfdPosition(view, tiffHeaderOffset, littleEndian);

  let ifd0 = readTags(view, ifdPosition, tiffHeaderOffset, littleEndian, exif);
  const entries = view.getUint16(ifdPosition, littleEndian);
  const thumbnailPosition = view.getUint32(ifdPosition + 2 + entries * 12, littleEndian);

  if (ifdPosition !== 0)
    ifd0 = {...ifd0, ...readTags(view, thumbnailPosition + 6, tiffHeaderOffset, littleEndian, exif)};

  if (ifd0.ExifOffset)
    ifd0 = {...ifd0, ...readTags(view, ifd0.ExifOffset + 6, tiffHeaderOffset, littleEndian, exif)};

  if (ifd0.InteropOffset)
    ifd0 = {...ifd0, ...readTags(view, tiffHeaderOffset + ifd0.InteropOffset, tiffHeaderOffset, littleEndian, exif)};

  if (ifd0.GPSInfo)
    ifd0 = {...ifd0, ...readTags(view, tiffHeaderOffset + ifd0.GPSInfo, tiffHeaderOffset, littleEndian, gps)};

	for (const [key, parser] of Object.entries(parse)) {
		const value = ifd0[key];
		if (value) ifd0[key] = parser(value);
	}

  return ifd0;
}

function readTags(view, ifdPosition, tiffHeaderOffset, littleEndian, tags) {
  const result = {};
  const fieldIterator = iterateIfdFields(view, ifdPosition, littleEndian);
  for (const offset of fieldIterator) {
    const tag = view.getUint16(offset, littleEndian);
    if (!tags[tag]) continue;
    let value = readTagValue(view, offset, tiffHeaderOffset, littleEndian);
    if (value) result[tags[tag]] = value;
  }
  return result;
}

function readTagValue(view, offset, tiffHeaderOffset, littleEndian) {
  const type = view.getUint16(offset + consts.ifd.type, littleEndian);
  const count = view.getUint32(offset + consts.ifd.count, littleEndian);
  const value = view.getUint32(offset + consts.ifd.value, littleEndian) + tiffHeaderOffset;
  const state = { value, offset, littleEndian, count }

  if (type == 1 || type == 7)
    return read.unsignedByte(view, state);

  if (type == 2)
    return read.ASCII(view, state);

	if (type == 3)
    return read.unsignedShort(view, state);

	if (type == 4)
    return read.unsignedLong(view, state);

	if (type == 5)
    return read.unsignedRational(view, state);

	if (type == 9)
    return read.signedLong(view, state);

	if (type == 10)
    return read.signedRational(view, state);
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
  const arrayBuffer = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsArrayBuffer(file);
  });
  return arrayBuffer;
}

function isValidJpeg(view) {
  return view.byteLength >= 2 && view.getUint16(0, false) === consts.jpeg;
}

async function findExifSegmentOffset (view) {
  for await (const segmentPosition of iterateMarkerSegments(view)) {
    if (isExifSegment(view, segmentPosition)) {
      assertExifSegment(view, segmentPosition);
      return segmentPosition;
    }
  }
  return -1;
}

/**
 * APPx/Exif p.18, 19, 150
 * - marker (short) `0xffe1` = APP1
 * - length (short) of segment
 * - padding (short) `0x0000` if exif
 * - "EXIF" (char[4]) if exif
 * - content
 * (The doc describe APP1 have to lay next to the SOI,
 *  however, Photoshop renders a JPEG file that SOI is followed by APP0.)
 */
async function* iterateMarkerSegments (view) {
  let segmentPosition = consts.firstMarker;
  while (true) {
    yield segmentPosition;
    const offsetLength = consts.segment.length;
    const length = offsetLength + view.getUint16(segmentPosition + offsetLength, false);
    segmentPosition += length;
    if (segmentPosition > view.byteLength) return -1;
  }
}

function isExifSegment (view, segmentPosition) {
  const marker = view.getUint16(segmentPosition + consts.segment.marker, false);
  return marker === consts.exifMarker;
}

function assertExifSegment (view, segmentPosition) {
  // p 150
  const id = view.getUint32(segmentPosition + consts.segment.exifId, false);
  if (id !== consts.exifId) {
    throw new Error(`Segment marked as Exif does not have Exif identifier`);
  }
}

function isLittleEndian(view, tiffHeaderOffset) {
  const endian = view.getUint16(tiffHeaderOffset + consts.tiffHeader.byteOrder, false);
  const littleEndian = endian === consts.orderLittleEndian;
  return littleEndian;
}

/*
 * TIFF Header p.17
 * - byte order (short). `0x4949` = little, `0x4d4d` = big
 * - 42 (0x002a) (short)
 * - offset of IFD (long). Minimum is `0x00000008` (8).
 */
function findIfdPosition(view, tiffHeaderOffset, littleEndian) {
  const endianAssertionValue = view.getUint16(tiffHeaderOffset + consts.tiffHeader.endianAssertion, littleEndian);
  if (endianAssertionValue !== consts.endianAssertion) {
    throw new Error(`Invalid JPEG format: littleEndian ${littleEndian}, assertion: 0x${endianAssertionValue}`);
  }
  const ifdDistance = view.getUint32(tiffHeaderOffset + consts.tiffHeader.ifdOffset, littleEndian);
  return tiffHeaderOffset + ifdDistance;
}

/**
 * IFD p.23
 * - num of IFD fields (short)
 * - IFD:
 *   - tag (short)
 *   - type (short)
 *   - count (long)
 *   - value offset (long)
 * - IFD...
 */
function* iterateIfdFields (view, ifdFieldOffset, littleEndian) {
  const numOfIfdFields = view.getUint16(ifdFieldOffset, littleEndian);
  const fieldLength = 12;
  for (let i = 0; i < numOfIfdFields; i++) {
    const currentOffset = ifdFieldOffset + i * fieldLength + 2;
    yield currentOffset;
  }
}
