const fs = require('fs').promises;
const path = require('path');

const baseFolder = path.join(__dirname);
const stylesFolder = path.join(__dirname, 'styles');
const baseHtml = path.join(__dirname, 'template.html');
const  componentsFolder = path.join(__dirname, 'components');

const getFiles = async (folder) => {
  return await fs.readdir(folder, {withFileTypes: true});
};

const createFolder = async (baseFolder, folderName) => {
  const baseFolderElement = await fs.readdir(baseFolder);
  let flag = false;

  for (const element of baseFolderElement) {
    if (element === folderName) {
      flag = true;
    } 
  }

  if (!flag) {
    await fs.mkdir(path.join(baseFolder, folderName));
  }
  return path.join(baseFolder, folderName);
}

const createRewritedFile = async (file, componentsFolder) => {
  let newFile = await fs.readFile(file, 'utf-8');
  const tags = (await fs.readdir(componentsFolder)).map(el => {
    el = el.replace(/.html/, '');
    return `{{${el}}}`;
  });

  for (const tag of tags) {
    if (newFile.match(tag)) {
      const pattern = tag.match(/[a-z]/g).join('');
      const componentsFile = await fs.readFile(path.join(componentsFolder, `${pattern}.html`), 'utf-8');
      newFile = newFile.replace(new RegExp(tag, 'g'), `${componentsFile}`);
    }
  }
  return newFile;
}

const makeBundle = async (baseFolder, projectFolder, bundleName) => {
  const files = await getFiles(baseFolder);
  let result = [];

  for (const file of files) {
    let fileExt = path.extname(file.name);

    if (file.isFile() && fileExt === '.css') {
      let data = await fs.readFile(path.join(baseFolder, file.name), 'utf-8');
      result.push(data);
    }
  }
  await fs.writeFile(path.join(projectFolder, bundleName), result.join('\n'), 'utf-8');
}

const copyFolders = async (baseAssetsFolder, projectAssetsFolder) => {
  let folders = await fs.readdir(baseAssetsFolder, { withFileTypes: true });

  for (const folder of folders) {
    let basePath = path.join(baseAssetsFolder, folder.name);
    let projectPath = path.join(projectAssetsFolder, folder.name);

    if (folder.isDirectory()) {
      await createFolder(projectAssetsFolder, folder.name);
      await copyFolders(basePath, projectPath);
    } 
    else {
      await fs.copyFile(basePath, projectPath);
    }
  }
}

const collectFolder = async (baseFolder, stylesFolder, componentsFolder, baseHtml) => {
  const projectFolder = await createFolder(baseFolder, 'project-dist');
  const newFile = await createRewritedFile(baseHtml, componentsFolder);

  await fs.writeFile(path.join(projectFolder, 'index.html'), newFile, 'utf-8');

  await makeBundle(stylesFolder, projectFolder, 'style.css');

  await fs.mkdir(path.join(projectFolder, 'assets'), { recursive: true });

  const projectAssetsFolder = path.join(projectFolder, 'assets');
  const baseAssetsFolder = path.join(baseFolder, 'assets');

  await copyFolders(baseAssetsFolder, projectAssetsFolder);
}

collectFolder(baseFolder, stylesFolder, componentsFolder, baseHtml);