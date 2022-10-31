const { readdir, copyFile, rm, mkdir } = require("fs/promises");
const path = require("path");

const baseDir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

const getFiles = async (dir) => {
  const files = await readdir(dir);
  return files;
}

const copyFiles = async (from, to) => {
  await mkdir(copyDir, { recursive: true });
  const baseFiles = await getFiles(from);
  const copyFiles = await getFiles(to);

  if (baseFiles !== copyFiles) {
    await rm(to, { recursive: true });
    await mkdir(copyDir, { recursive: true });
    for (const file of baseFiles) {
      await copyFile(path.join(from, file), path.join(to, file));
    }
  }
}

copyFiles(baseDir, copyDir);
