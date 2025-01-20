const fs = require('fs');
const path = require('path');

const stylesDirectory = path.join(__dirname, 'styles');
const outputDirectory = path.join(__dirname, 'project-dist');
const bundledStylesFile = path.join(outputDirectory, 'bundle.css');

fs.readdir(stylesDirectory, (error, files) => {
  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  const collectedStyles = [];

  cssFiles.forEach((file) => {
    const filePath = path.join(stylesDirectory, file);

    fs.readFile(filePath, 'utf8', (error, data) => {
      collectedStyles.push(data);

      if (collectedStyles.length === cssFiles.length) {
        fs.writeFile(
          bundledStylesFile,
          collectedStyles.join('\n'),
          'utf8',
          () => {
            console.log('Good');
          },
        );
      }
    });
  });
});
