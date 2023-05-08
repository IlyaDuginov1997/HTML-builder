const {stdout} = process;
const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(dirPath, 'utf-8');

let data = '';

stream.on('data', chunk => data += chunk);

stream.on('end', () => stdout.write(data));

stream.on('error', error => console.log('Error', error.message));