const {stdin, stdout} = process;
const fs = require('fs');
const path = require('path');

const currentDirectory = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(currentDirectory);

process.on('exit', () => stdout.write('Have a good luck!'));
process.on('SIGINT', () => {
  process.exit();
});

stdout.write('Enter your text\n');

stdin.on('data', chunk => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else {
    output.write(chunk);
  }
});

stdin.on('error', error => console.log('Error', error.message));