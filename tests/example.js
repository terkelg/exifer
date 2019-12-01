const exifer = require('../packages/exifer/dist/exifer.js');
const fs = require('fs');

(async function(){
	let img = fs.readFileSync('./photo.jpg');
	let res = await exifer(img);
	console.log(res);
})();
