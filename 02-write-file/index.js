const path = require('path');
const fs = require('fs');
const { stdin: input, stdout: output } = process;
const readLine = require('readline');

const file = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

const rl = readLine.createInterface({ input, output });
console.log('Enter your text');

rl.on('line', (chunk) => {
  if (chunk === 'exit') {
    file.end();
    rl.close();
  } else {
    file.write(chunk + '\n');
  }
});

rl.on('close', () => {
  output.write('You finished input');
});
