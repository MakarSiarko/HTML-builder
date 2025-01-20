const fs = require('fs/promises');
const path = require('path');

async function createCopyDir() {
  await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
}

async function readFilesDir() {
  return await fs.readdir(path.join(__dirname, 'files'), {
    withFileTypes: true,
  });
}

async function copyFiles(files) {
  for (const file of files) {
    const srcPath = path.join(__dirname, 'files', file.name);
    const destPath = path.join(__dirname, 'files-copy', file.name);

    if (file.isFile()) {
      await fs.copyFile(srcPath, destPath);
    } else if (file.isDirectory()) {
      await copyDir(srcPath, destPath);
    }
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const files = await fs.readdir(src, { withFileTypes: true });
  await copyFiles(files);
}

async function main() {
  await createCopyDir();
  const files = await readFilesDir();
  await copyFiles(files);
}

main().catch(console.error);
