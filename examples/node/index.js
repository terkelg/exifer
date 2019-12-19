const exifer = require('../../packages/exifer/dist/exifer.js');

const gps = require('../../packages/gps/dist/exifer-gps.js');
const exif = require('../../packages/exif/dist/exifer-exif.js');
const iptc = require('../../packages/iptc/dist/exifer-iptc.js');

const {join} = require('path');
const fs = require('fs');

let filename = process.argv.slice(2);

(async function() {
	console.log(filename);
	const file = join(__dirname, filename[0]);

	const buffer = fs.readFileSync(file);
	const tags = await exifer(buffer, {skipxmp: false, skipiptc: false, tags: {gps, exif, iptc}});

	console.log(tags);
})();
