const fs = require('fs');
const path = require('path');


const destStylesPath = path.join(__dirname, 'project-dist', 'bundle.css');
const srcDirectory = path.join(__dirname, 'styles');


fs.access(destStylesPath, fs.constants.F_OK, async (err) => {
  if (!err) {
    await fs.promises.rm(destStylesPath);
  }

  await readFiles();
});

const readFiles = async () => {
  try {
    const files = await fs.promises.readdir(srcDirectory, {withFileTypes: true});

    const writeStream = fs.createWriteStream(destStylesPath);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(srcDirectory, file.name);

      if (file.isFile() && path.extname(filePath) === '.css') {
        let data = '';

        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.on('data', chunk => data += chunk);
        readStream.on('end', () => writeStream.write(data));
      }
    }
  } catch (err) {
    console.log('err in reading file, err:', err);
  }
};