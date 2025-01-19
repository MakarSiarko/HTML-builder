const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFilesInfo() {
  const files = await fs.readdir(folderPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileStats = await fs.stat(filePath);
      const fileSize = (fileStats.size / 1024).toFixed(3);
      const fileExt = path.extname(file.name).slice(1);
      const fileName = path.basename(file.name, path.extname(file.name));

      console.log(`${fileName} - ${fileExt} - ${fileSize}kb`);
    }
  }
}

displayFilesInfo();
