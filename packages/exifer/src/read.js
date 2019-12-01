// byte, 8-bit unsigned int, undefined, 8-bit byte
export function unsignedByte(view, {count, value, offset, littleEndian}) {
  if (count == 1) return view.getUint8(offset + 8, littleEndian);
  let o = count > 4 ? value : (offset + 8);
  let vals = [];
  for (let n=0;n<count;n++) {
    vals[n] = view.getUint8(o + n);
  }
  return vals;
}

export function ASCII(view, {count, value, offset}) {
  let start = count > 4 ? value : (offset + 8);
  let str = '';
  for (let n = start; n < start+count-1; n++) {
    str += String.fromCharCode(view.getUint8(n));
  }
  return str;
}

// short 16 bit int
export function unsignedShort(view, {count, value, offset, littleEndian}) {
	if (count == 1) return view.getUint16(offset + 8, littleEndian);
	let o = count > 2 ? value : (offset + 8);
	let vals = [];
	for (let n=0; n < count; n++) {
		vals[n] = view.getUint16(o + 2*n, littleEndian);
	}
	return vals;
}

// long, 32 bit int
export function unsignedLong(view, {count, value, offset, littleEndian}) {
	if (count == 1) return view.getUint32(offset + 8, littleEndian);
	let vals = [];
	for (let n=0; n < count; n++) {
		vals[n] = view.getUint32(value + 4*n, littleEndian);
	}
	return vals;
}

// unisgned rational
export function unsignedRational(view, {count, value, littleEndian}) {
  if (count == 1) {
    let numerator = view.getUint32(value, littleEndian);
    let denominator = view.getUint32(value+4, littleEndian);
    let val = new Number(numerator / denominator);
    val.numerator = numerator;
    val.denominator = denominator;
    return val;
  } else {
    let vals = [];
    for (let n=0; n < count; n++) {
      let numerator = view.getUint32(value + 8*n, littleEndian);
      let denominator = view.getUint32(value+4 + 8*n, littleEndian);
      vals[n] = new Number(numerator / denominator);
      vals[n].numerator = numerator;
      vals[n].denominator = denominator;
    }
    return vals;
  }
}

// long, 32 bit int
export function signedLong(view, {count, value, offset, littleEndian}) {
  if (count == 1) return file.getInt32(offset + 8, littleEndian);
  let vals = [];
  for (let n = 0; n < count; n++) {
    vals[n] = view.getInt32(value + 4*n, littleEndian);
  }
  return vals;
}

// long, 32 bit int
export function signedRational(view, {count, value, littleEndian}) {
  if (count == 1) return view.getInt32(value, littleEndian) / view.getInt32(value+4, littleEndian);
  let vals = [];
  for (let n=0; n < count; n++) {
    vals[n] = view.getInt32(value + 8*n, littleEndian) / view.getInt32(value+4 + 8*n, littleEndian);
  }
  return vals;
}
