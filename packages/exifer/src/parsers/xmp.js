import {viewToString} from '../types.js';

const XMP_START = `<x:xmpmeta`;
const XMP_END = `x:xmpmeta>`;

export function parseXmp(view, chunks) {
	const xmp = extract(view, chunks)
		.map(chunk => viewToString(chunk, 0, chunk.byteLength))
		.join('\n');
	const from = xmp.indexOf(XMP_START);
	const to = xmp.indexOf(XMP_END) + XMP_START.length;
	return {xmp: xmp.slice(from, to)};
}

function extract(view, chunks) {
	if (!chunks.length) return [];
	const completeChunks = [combine(view, chunks.slice(0, 1))];
	if (chunks.length > 1) completeChunks.push(combine(view, chunks.slice(1)));
	return completeChunks;
}

function combine(view, chunks) {
	const totalLength = chunks.reduce((size, chunk) => size + chunk.length, 0);
	const combinedChunks = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		const slice = view.buffer.slice(chunk.dataOffset, chunk.dataOffset + chunk.length);
		combinedChunks.set(new Uint8Array(slice), offset);
		offset += chunk.length;
	}
	return new DataView(combinedChunks.buffer);
}
