const fs = require('fs');
const path = require('path');

const currentDirectory = path.join(__dirname, 'secret-folder');

fs.promises.readdir(currentDirectory)
  .then(filenames => {
    for (let filename of filenames) {

      const pathName = path.join(__dirname, 'secret-folder', filename);

      fs.stat(pathName, (err, stats) => {
        if (!stats.isDirectory()) {
          const extension = path.extname(pathName).slice(1);
          console.log(`${filename} - ${extension} - ${stats.size}`);
        }
      });
    }
  })
  .catch(err => {
    console.log(err);
  });
