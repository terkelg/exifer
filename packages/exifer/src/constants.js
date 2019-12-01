export const orderLittleEndian = 0x4949;

export const endianAssertion = 0x002a;

export const jpeg = 0xffd8;

export const exifMarker = 0xffe1;

export const exifId =  0x45786966; // "E", "X", "I", "F"

export const firstMarker = 2;

export const segment = {
	marker: 0,
	length: 2,
	exifId: 4,
};

export const tiffHeader = {
	fromSegment: 10,
	byteOrder: 0,
	endianAssertion: 2,
	ifdOffset: 4,
};

export const ifd = {
	fromTiffHeader: -1,
	tag: 0,
	type: 2,
	count: 4,
	value: 8,
}
