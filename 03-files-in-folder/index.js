const path = require("path");
const fs = require("fs");

const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, {withFileTypes: true}, (err, data) => {
  data.forEach(file => {
    if (file.isFile()) {
      let filePath = path.join(pathFolder, file.name);
      let fileExt = path.extname(file.name);
      let fileName = path.basename(filePath, fileExt);
      
      fs.stat(filePath, (err, stats) => {
        console.log(`${fileName} - ${fileExt.replace(/./, '')} - ${stats.size}b`);
      });
    }
  })
});

