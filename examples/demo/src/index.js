import {exifer} from '../../dist/exifer.mjs';

const picker = document.querySelector('.file');
const result = document.querySelector('.result');

picker.addEventListener('change', async () => {
  let file = picker.files[0];
  console.log(file instanceof Blob);
  // EXIF.getData(file, function() {
  //   // let make = EXIF.getTag(this, "Make");
  //   // let model = EXIF.getTag(this, "Model");
  //   let all = EXIF.getAllTags(this)
  //   console.log('THEIR');
  //   console.log(all);
  // })

  console.log(await exifer(file));
});
