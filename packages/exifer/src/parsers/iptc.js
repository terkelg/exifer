import * as tags from '../tags.js';
import {arrayToString, viewToValue} from '../types.js';

const BYTES_8BIM = 0x3842494d; // "8", "B", "I", "M"
const BYTES_8BIM_SIZE = 4;
const RESOURCE_BLOCK_HEADER_SIZE = BYTES_8BIM_SIZE + 8;
const RESOURCE_BLOCK_SIZE_OFFSET = 10;
const NAA_RESOURCE_BLOCK_TYPE = 0x0404;
const TAG_HEADER_SIZE = 5;
const TAG_CODE_OFFSET = 1;
const TAG_SIZE_OFFSET = 3;
const TAG_LEAD_BYTE = 0x1c;

const blockPadding = size => (size % 2 !== 0 ? 1 : 0);
const isNaaResourceBlock = type => type === NAA_RESOURCE_BLOCK_TYPE;
const isLeadByteMissing = (view, dataOffset) => view.getUint8(dataOffset) !== TAG_LEAD_BYTE;

export function parseIptc(view, dataOffset, extraTags = {}) {
	const iptc = {...tags.iptc, ...extraTags.iptc};
	const {naaSize, dataOffset: newDataOffset} = getNaaResourceBlock(view, dataOffset, tags);
	return readTags(view, naaSize, newDataOffset, iptc);
}

function getNaaResourceBlock(view, dataOffset) {
	while (dataOffset + RESOURCE_BLOCK_HEADER_SIZE <= view.byteLength) {
		if (view.getUint32(dataOffset, false) !== BYTES_8BIM) throw new Error(`Not an IPTC resource block`);
		const resourceType = view.getUint16(dataOffset + BYTES_8BIM_SIZE, false);
		const resourceSize = view.getUint16(dataOffset + RESOURCE_BLOCK_SIZE_OFFSET, false);
		if (isNaaResourceBlock(resourceType)) return {naaSize: resourceSize, dataOffset};
		dataOffset += RESOURCE_BLOCK_HEADER_SIZE + resourceSize + blockPadding(resourceSize);
	}
	throw new Error(`No IPTC NAA resource block`);
}

function readTags(view, naaSize, dataOffset, tags) {
	const result = {};
	dataOffset += RESOURCE_BLOCK_HEADER_SIZE;
	const endOfBlockOffset = dataOffset + naaSize;
	while (dataOffset < endOfBlockOffset && dataOffset < view.byteLength) {
		if (isLeadByteMissing(view, dataOffset)) continue;
		const tag = view.getUint16(dataOffset + TAG_CODE_OFFSET, false);
		const count = view.getUint16(dataOffset + TAG_SIZE_OFFSET, false);
		const value = viewToValue(view, {offset: dataOffset + TAG_HEADER_SIZE, count});
		if (value && tags[tag]) readTagValue(value, result, tags[tag]);
		dataOffset += TAG_HEADER_SIZE + count;
	}
	return result;
}

function readTagValue(value, result, {name, parse = x => x, raw}) {
	value = parse(raw ? value : arrayToString(value));
	result[name] = !result[name] ? value : Array.isArray(result[name]) ? [...result[name], value] : [result[name], value];
}
