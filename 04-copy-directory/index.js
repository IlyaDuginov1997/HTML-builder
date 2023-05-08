const fs = require('fs');
const path = require('path');

const FILES = 'files';
const FILES_COPY = 'files-copy';

const srcDirectory = path.join(__dirname, FILES);
const destDirectory = path.join(__dirname, FILES_COPY);

const deleteFile = async (files) => {
  try {
    for (let j = 0; j < files.length; j++) {
      await fs.promises.rm(path.join(destDirectory, files[j]));
    }
  } catch (err) {
    console.log('error in deleted block, err:', err);
  }
};

const copyDirectory = async () => {
  try {
    await fs.promises.mkdir(destDirectory, {recursive: true});
    const files = await fs.promises.readdir(srcDirectory, {withFileTypes: true});

    const copiedFiles = await fs.promises.readdir(destDirectory, {withFileTypes: true});
    let copiedFilesArr = copiedFiles.map(el => el.name);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.isFile()) {
        const currentFile = path.join(srcDirectory, file.name);
        const copiedFile = path.join(destDirectory, file.name);

        await fs.promises.copyFile(currentFile, copiedFile);
        copiedFilesArr = copiedFilesArr.filter(el => el !== file.name);
      }
    }

    if (copiedFilesArr.length) {
      await deleteFile(copiedFilesArr);
    }

  } catch (err) {
    console.log(err);
  }
};

void copyDirectory();


