import { generic, date, string, color, gps } from './util';

export const ColorSpace = color;
export const GPSVersionID = gps;
export const GPSDateStamp = date;
export const GPSTimeStamp = date;
export const DateTimeOriginal = date;
export const DateTimeDigitized = date;
export const ModifyDate = date;
export const ExifVersion = string;
export const Orientation = generic({
	1: { rotation: 0, flipped: false },
	6: { rotation: 90, flipped: false },
	3: { rotation: 180, flipped: false },
	8: { rotation: 270, flipped: false },
	2: { rotation: 0, flipped: false },
	5: { rotation: 90, flipped: true },
	4: { rotation: 180, flipped: false },
	7: { rotation: 270, flipped: false }
});
export const ExposureProgram = generic({
	0: `Not defined`,
	1: `Manual`,
	2: `Normal program`,
	3: `Aperture priority`,
	4: `Shutter priority`,
	5: `Creative program`,
	6: `Action program`,
	7: `Portrait mode`,
	8: `Landscape mode`
});
export const MeteringMode = generic({
	0: `Unknown`,
	1: `Average`,
	2: `CenterWeightedAverage`,
	3: `Spot`,
	4: `MultiSpot`,
	5: `Pattern`,
	6: `Partial`,
	255: `Other`
});
export const LightSource = generic({
	0: `Unknown`,
	1: `Daylight`,
	2: `Fluorescent`,
	3: `Tungsten (incandescent light)`,
	4: `Flash`,
	9: `Fine weather`,
	10: `Cloudy weather`,
	11: `Shade`,
	12: `Daylight fluorescent (D 5700 - 7100K)`,
	13: `Day white fluorescent (N 4600 - 5400K)`,
	14: `Cool white fluorescent (W 3900 - 4500K)`,
	15: `White fluorescent (WW 3200 - 3700K)`,
	17: `Standard light A`,
	18: `Standard light B`,
	19: `Standard light C`,
	20: `D55`,
	21: `D65`,
	22: `D75`,
	23: `D50`,
	24: `ISO studio tungsten`,
	255: `Other`
});
export const Flash = generic({
	0x0000: `Flash did not fire`,
	0x0001: `Flash fired`,
	0x0005: `Strobe return light not detected`,
	0x0007: `Strobe return light detected`,
	0x0009: `Flash fired, compulsory flash mode`,
	0x000D: `Flash fired, compulsory flash mode, return light not detected`,
	0x000F: `Flash fired, compulsory flash mode, return light detected`,
	0x0010: `Flash did not fire, compulsory flash mode`,
	0x0018: `Flash did not fire, auto mode`,
	0x0019: `Flash fired, auto mode`,
	0x001D: `Flash fired, auto mode, return light not detected`,
	0x001F: `Flash fired, auto mode, return light detected`,
	0x0020: `No flash function`,
	0x0041: `Flash fired, red-eye reduction mode`,
	0x0045: `Flash fired, red-eye reduction mode, return light not detected`,
	0x0047: `Flash fired, red-eye reduction mode, return light detected`,
	0x0049: `Flash fired, compulsory flash mode, red-eye reduction mode`,
	0x004D: `Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected`,
	0x004F: `Flash fired, compulsory flash mode, red-eye reduction mode, return light detected`,
	0x0059: `Flash fired, auto mode, red-eye reduction mode`,
	0x005D: `Flash fired, auto mode, return light not detected, red-eye reduction mode`,
	0x005F: `Flash fired, auto mode, return light detected, red-eye reduction mode`
});
export const SensingMethod = generic({
	1: `Not defined`,
	2: `One-chip color area sensor`,
	3: `Two-chip color area sensor`,
	4: `Three-chip color area sensor`,
	5: `Color sequential area sensor`,
	7: `Trilinear sensor`,
	8: `Color sequential linear sensor`
});
export const SceneCaptureType = generic({
	0: `Standard`,
	1: `Landscape`,
	2: `Portrait`,
	3: `Night scene`
});
export const SceneType = generic({
	1: `Directly photographed`
});
export const CustomRendered = generic({
	0: `Normal process`,
	1: `Custom process`
});
export const WhiteBalance = generic({
	0: `Auto white balance`,
	1: `Manual white balance`
});
export const GainControl = generic({
	0: `None`,
	1: `Low gain up`,
	2: `High gain up`,
	3: `Low gain down`,
	4: `High gain down`
});
export const Contrast = generic({
	0: `Normal`,
	1: `Soft`,
	2: `Hard`
});
export const Saturation = generic({
	0: `Normal`,
	1: `Low saturation`,
	2: `High saturation`
});
export const Sharpness = generic({
	0: `Normal`,
	1: `Soft`,
	2: `Hard`
});
export const SubjectDistanceRange = generic({
	0: `Unknown`,
	1: `Macro`,
	2: `Close view`,
	3: `Distant view`
});
export const FileSource = generic({
	3: `DSC`
});
export const Components = generic({
	0: ``,
	1: `Y`,
	2: `Cb`,
	3: `Cr`,
	4: `R`,
	5: `G`,
	6: `B`
});
