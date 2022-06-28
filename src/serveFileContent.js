const fs = require('fs');
const path = require('path');

const getMimeType = (extension) => {
  const mimeTypes = { '.html': 'text/html', '.jpg': 'image/jpeg' };
  return mimeTypes[extension];
};

const createServeFileContent = (rootDir) => ({ uri }, response) => {
  if (uri === '/') {
    uri = '/index.html';
  }
  const fileName = path.join(rootDir, uri);
  try {
    const fileContent = fs.readFileSync(fileName);
    const extension = path.extname(fileName);
    response.addHeader('content-type', getMimeType(extension));
    response.send(fileContent);
  } catch (err) {
    return false;
  }
  return true;
};

module.exports = { createServeFileContent };
