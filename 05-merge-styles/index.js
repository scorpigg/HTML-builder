const fs = require('fs').promises;
const { readdir } = require('fs/promises');
const path = require('path');

const baseFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');

const getFiles = async (folder) => {
  return await readdir(folder, {withFileTypes: true});
};

async function makeBundle(baseFolder, projectFolder) {
  const files = await getFiles(baseFolder);
  let result = [];

  await fs.appendFile(path.join(projectFolder, 'bundle.css'), 'utf-8');

  for (const file of files) {
    let fileExt = path.extname(file.name);

    if (file.isFile() && fileExt === '.css') {
      let data = await fs.readFile(path.join(baseFolder, file.name), 'utf-8');
      result.push(data);
    }
  }
  await fs.writeFile(path.join(projectFolder, 'bundle.css'), result.join('\n'), 'utf-8');
}

makeBundle(baseFolder, projectFolder);