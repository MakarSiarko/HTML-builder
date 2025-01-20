const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

const templateFilePath = path.join(__dirname, 'template.html');
let templateContent = '';

fs.readFile(templateFilePath, 'utf8', (err, data) => {
  if (err) throw err;
  templateContent = data;
  replaceTemplateTags();
});

function replaceTemplateTags() {
  const componentsDirectory = path.join(__dirname, 'components');
  fs.readdir(componentsDirectory, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const componentName = path.basename(file, '.html');
      const componentFilePath = path.join(componentsDirectory, file);

      fs.readFile(componentFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const tag = `{{${componentName}}}`;
        templateContent = templateContent.replace(new RegExp(tag, 'g'), data);

        fs.writeFile(
          path.join(__dirname, 'project-dist', 'index.html'),
          templateContent,
          (err) => {
            if (err) throw err;
          },
        );
      });
    });
  });
}

const stylesDirectory = path.join(__dirname, 'styles');
const outputStyleFilePath = path.join(__dirname, 'project-dist', 'style.css');

fs.readdir(stylesDirectory, (err, files) => {
  if (err) throw err;

  files = files.filter((file) => path.extname(file) === '.css');
  let compiledStyles = '';

  files.forEach((file) => {
    const styleFilePath = path.join(stylesDirectory, file);
    fs.readFile(styleFilePath, 'utf8', (err, data) => {
      if (err) throw err;
      compiledStyles += data;

      fs.writeFile(outputStyleFilePath, compiledStyles, (err) => {
        if (err) throw err;
      });
    });
  });
});

const assetsSourceDirectory = path.join(__dirname, 'assets');
const assetsDestinationDirectory = path.join(
  __dirname,
  'project-dist',
  'assets',
);

function copyDirectory(source, destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(source, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const sourceFilePath = path.join(source, file);
        const destinationFilePath = path.join(destination, file);

        fs.stat(sourceFilePath, (err, stats) => {
          if (err) throw err;

          if (stats.isDirectory()) {
            copyDirectory(sourceFilePath, destinationFilePath);
          } else {
            fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  });
}

copyDirectory(assetsSourceDirectory, assetsDestinationDirectory);
