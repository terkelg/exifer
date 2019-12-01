import exifer from '../../packages/exifer/src/index.js';
import { join, dirname } from 'path';
import test from 'tape';
import fs from 'fs';

const moduleURL = new URL(import.meta.url);
const file = join(dirname(moduleURL.pathname), `photo.jpg`);

(async function(){
	const buffer = fs.readFileSync(file);
	const parsed = await exifer(buffer);
	console.log(parsed);
})();

