export const generic = map => input => map[input] || input;

export const int16u = x => parseInt(((x[0] << 8) + x[1]).toString());

export const timeISO8601 = time => {
	const [, hh, mm, ss, zone] = time.match(/(\d{2})(\d{2})(\d{2})([-+]\d{4})?/);
	return new Date(`1970-01-01T${hh}:${mm}:${ss}${zone || '+0000'}`);
};

export const date = x => {
	let y = x.slice(0, 4);
	let m = x.slice(4, 6);
	let d = x.slice(6, 8);
	return new Date(y, m - 1, d);
};
