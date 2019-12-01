export const generic = map => input => map[input] || input;

export const date = input => {
  const match = input.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
  return new Date(Date.UTC(
    match[1] || 0,
    match[2] - 1 || 0,
    match[3] || 0,
    match[4] || 0,
    match[5] || 0,
    match[6] || 0,
    0
  ));
}

export const string = input => {
	return input.map(code => String.fromCharCode(code)).join('');
}

export const color = string => {
	if (string == 1) return 'sRGB';
	if (string == 65535) return 'Uncalibrated';
	return string;
}

export const gps = string => {
	return `${string[0]}.${string[1]}.${string[2]}.${string[3]}`;
}
