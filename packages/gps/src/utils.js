export const generic = map => input => map[input] || input;

export const date = input => {
	const match = input.match(/^(\d{4}):(\d{2}):(\d{2})$/);
	return new Date(Date.UTC(match[1] || 0, match[2] - 1 || 0, match[3] || 0, 0, 0, 0, 0));
};
