export const IFD_EXIF = 'ExifIFDPointer';
export const IFD_GPS = 'GPSInfoIFDPointer';
export const IFD_INTEROP = 'InteroperabilityIFDPointer';

export const exif = {
	0x8825: {name: IFD_GPS},
	0x8769: {name: IFD_EXIF},
	0xa005: {name: IFD_INTEROP},
	0x010f: {name: 'Make'},
	0x0110: {name: 'Model'},
	0x0112: {name: 'Orientation'},
	0x011a: {name: 'XResolution'},
	0x011b: {name: 'YResolution'},
	0x0131: {name: 'Software'},
	0x0132: {name: 'ModifyDate'},
	0x8827: {name: 'ISO'},
	0x9209: {name: 'Flash'},
	0xa002: {name: 'PixelXDimension'},
	0xa003: {name: 'PixelYDimension'}
};

export const gps = {
	0x0002: {name: 'GPSLatitude'},
	0x0006: {name: 'GPSAltitude'},
	0x0004: {name: 'GPSLongitude'}
};

export const iptc = {
	0x0250: {name: 'Byline'},
	0x0255: {name: 'BylineTitle'},
	0x026e: {name: 'Credit'},
	0x0274: {name: 'CopyrightNotice'},
	0x0276: {name: 'Contact'}
};
