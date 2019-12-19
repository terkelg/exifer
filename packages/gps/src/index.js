import {date, generic} from './utils.js';

export default {
	0x0000: {name: 'GPSVersionID', parse: x => x.join('.')},
	0x0001: {
		name: 'GPSLatitudeRef',
		parse: generic({
			N: 'North',
			S: 'South'
		})
	},
	0x0002: {name: 'GPSLatitude'},
	0x0003: {
		name: 'GPSLongitudeRef',
		parse: generic({
			E: 'East',
			W: 'West'
		})
	},
	0x0004: {name: 'GPSLongitude'},
	0x0005: {
		name: 'GPSAltitudeRef',
		parse: generic({
			0: `Above Sea Level`,
			1: `Below Sea Level`
		})
	},
	0x0006: {name: 'GPSAltitude'},
	0x0007: {
		name: 'GPSTimeStamp',
		parse: x => {
			return new Date(Date.UTC(1970, 0, 1, x[0], x[1], x[2]));
		}
	},
	0x0008: {name: 'GPSSatellites'},
	0x0009: {
		name: 'GPSStatus',
		parse: generic({
			A: `Measurement Active`,
			V: `Measurement Void`
		})
	},
	0x000a: {name: 'GPSMeasureMode'},
	0x000b: {name: 'GPSDOP'},
	0x000c: {
		name: 'GPSSpeedRef',
		parse: generic({
			K: 'km/h',
			M: 'mph',
			N: 'knots'
		})
	},
	0x000d: {name: 'GPSSpeed'},
	0x000e: {
		name: 'GPSTrackRef',
		parse: generic({
			M: 'Magnetic North',
			T: 'True North'
		})
	},
	0x000f: {name: 'GPSTrack'},
	0x0010: {
		name: 'GPSImgDirectionRef',
		parse: generic({
			M: 'Magnetic North',
			T: 'True North'
		})
	},
	0x0011: {name: 'GPSImgDirection'},
	0x0012: {name: 'GPSMapDatum'},
	0x0013: {
		name: 'GPSDestLatitudeRef',
		parse: generic({
			N: 'North',
			S: 'South'
		})
	},
	0x0014: {name: 'GPSDestLatitude'},
	0x0015: {
		name: 'GPSDestLongitudeRef',
		parse: generic({
			E: 'East',
			W: 'West'
		})
	},
	0x0016: {name: 'GPSDestLongitude'},
	0x0017: {
		name: 'GPSDestBearingRef',
		parse: generic({
			M: 'Magnetic North',
			T: 'True North'
		})
	},
	0x0018: {name: 'GPSDestBearing'},
	0x0019: {
		name: 'GPSDestDistanceRef',
		parse: generic({
			K: 'Kilometers',
			M: 'Miles',
			N: 'Nautical Miles'
		})
	},
	0x001a: {name: 'GPSDestDistance'},
	0x001b: {name: 'GPSProcessingMethod'},
	0x001c: {name: 'GPSAreaInformation'},
	0x001d: {name: 'GPSDateStamp', parse: date},
	0x001e: {
		name: 'GPSDifferential',
		parse: generic({
			0: 'No Correction',
			1: 'Differential Corrected'
		})
	},
	0x001f: {name: 'GPSHPositioningError'}
};
