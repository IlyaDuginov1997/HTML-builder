const fs = require('fs');
const path = require('path');


const destDirectory = path.join(__dirname, 'project-dist');

const destStylesFile = path.join(destDirectory, 'style.css');
const srcStylesDirectory = path.join(__dirname, 'styles');

const destAssetsDirectory = path.join(destDirectory, 'assets');
const srcAssetsDirectory = path.join(__dirname, 'assets');

const destHtmlFile = path.join(destDirectory, 'index.html');
const templateHtmlFile = path.join(__dirname, 'template.html');
const srcComponentsDirectory = path.join(__dirname, 'components');


fs.access(destDirectory, fs.constants.F_OK, async (err) => {
  try {
    if (!err) {
      await fs.rmdir(destDirectory, {}, () => console.log('removed project-dist'));
    }
    await fs.promises.mkdir(destDirectory, {recursive: true});
    await copyDirectory(destAssetsDirectory, srcAssetsDirectory);
    await readWriteFiles(srcStylesDirectory, destStylesFile);
    await replaceHtmlTemplates(srcComponentsDirectory, destHtmlFile);
  } catch (err) {
    console.log('err: ', err);
  }
});


const readWriteFiles = async (srcDir, destFile) => {
  try {
    const files = await fs.promises.readdir(srcDir, {withFileTypes: true});
    const writeStream = fs.createWriteStream(destFile);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(srcDir, file.name);

      if (file.isFile() && path.extname(filePath) === '.css') {
        await writeFile(filePath, writeStream);
      }
    }
  } catch (err) {
    console.log('err in reading file, err:', err);
  }
};

const copyDirectory = async (destDirectory, srcDirectory) => {
  try {
    await fs.promises.mkdir(destDirectory, {recursive: true});
    const files = await fs.promises.readdir(srcDirectory, {withFileTypes: true});

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.isFile()) {
        const currentFile = path.join(srcDirectory, file.name);
        const copiedFile = path.join(destDirectory, file.name);
        await fs.promises.copyFile(currentFile, copiedFile);

      } else if (file.isDirectory()) {
        const deepDest = path.join(destDirectory, file.name);
        const deepSrc = path.join(srcDirectory, file.name);
        await copyDirectory(deepDest, deepSrc);
      }
    }
  } catch (err) {
    console.log('err in coping file, err:', err);
  }

};

const writeFile = async (file, writeStream) => {
  try {
    let data = '';
    const readStream = fs.createReadStream(file, 'utf-8');
    readStream.on('data', chunk => data += chunk);
    readStream.on('end', () => writeStream.write(data));
  } catch (err) {
    console.log(err);
  }
};

const replaceHtmlTemplates = async (srcDir, destFile) => {
  try {
    const templateHtmlStream = fs.createReadStream(templateHtmlFile, 'utf-8');
    const templateHtmlWriteStream = fs.createWriteStream(destFile);

    let templateData = '';
    templateHtmlStream.on('data', chunk => templateData += chunk);
    templateHtmlStream.on('end', async () => {
      await replaceTemplate(templateData, srcDir, templateHtmlWriteStream);
    });
  } catch (err) {
    console.log(err);
  }
};

const replaceTemplate = async (templateData, srcDir, writeStream) => {
  try {
    let templateDataString = templateData;
    const files = await fs.promises.readdir(srcDir, {withFileTypes: true});

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(srcDir, file.name);

      if (file.isFile() && path.extname(filePath) === '.html') {
        let data = '';

        const nameWithoutExt = path.parse(file.name).name;

        const templateStream = fs.createReadStream(filePath, 'utf8');
        await templateStream.on('data', chunk => data += chunk);
        await templateStream.on('end', () => {
          templateDataString = templateDataString.replace(`{{${nameWithoutExt}}}`, data);

          if (i === files.length - 1) writeStream.write(templateDataString);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};