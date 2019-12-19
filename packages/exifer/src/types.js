export const SIZES = {
	1: 1, // BYTE			- 8-bit unsigned integer
	2: 1, // ASCII			- 8-bit bytes w/ last byte null
	3: 2, // SHORT			- 16-bit unsigned integer
	4: 4, // LONG			- 32-bit unsigned integer
	5: 8, // RATIONAL  - 64-bit unsigned fraction
	7: 1, // UNDEFINED - 8-bit untyped data
	9: 4, // SLONG			- 32-bit signed integer
	10: 8, // SRATIONAL	- 64-bit signed fraction (2x32-bit signed integers)
	13: 4 // IFD
};

export const TYPES = {
	byte: 1,
	ascii: 2,
	short: 3,
	long: 4,
	rational: 5,
	undefined: 7,
	slong: 9,
	srational: 10,
	ifd: 13
};

export const read = {
	[TYPES.byte](view, offset, littleEndian) {
		return view.getUint8(offset, littleEndian);
	},
	[TYPES.short](view, offset, littleEndian) {
		return view.getUint16(offset, littleEndian);
	},
	[TYPES.long](view, offset, littleEndian) {
		return view.getUint32(offset, littleEndian);
	},
	[TYPES.rational](view, offset, littleEndian) {
		return this[TYPES.long](view, offset, littleEndian) / this[TYPES.long](view, offset + 4, littleEndian);
	},
	[TYPES.slong](view, offset, littleEndian) {
		return view.getInt32(offset, littleEndian);
	},
	[TYPES.srational](view, offset, littleEndian) {
		return this[TYPES.slong](view, offset, littleEndian) / this[TYPES.slong](view, offset + 4, littleEndian);
	},
	[TYPES.ifd](view, offset, littleEndian) {
		return this[TYPES.long](view, offset, littleEndian);
	},
	[TYPES.ascii](view, offset, littleEndian) {
		return this[TYPES.byte](view, offset, littleEndian);
	},
	[TYPES.undefined](view, state, littleEndian) {
		return this[TYPES.byte](view, state, littleEndian);
	}
};

export const getSize = name => SIZES[TYPES[name]];

export const arrayToString = arr => arr.map(c => String.fromCharCode(c)).join('');

export const viewToString = (view, offset, count) => arrayToString(viewToValue(view, {offset, count}));

export function viewToValue(view, {offset, type = TYPES.byte, count, littleEndian}) {
	const value = [];
	for (let valueIndex = 0; valueIndex < count; valueIndex++) {
		value.push(read[type](view, offset, littleEndian));
		offset += SIZES[type];
	}
	return value;
}

export function parseViewValue(value, type = TYPES.ascii) {
	if (type === TYPES.ascii) {
		value = arrayToString(value);
		return value.endsWith('\0') ? value.slice(0, -1) : value;
	}
	if (value.length === 1) value = value[0];
	return value;
}
