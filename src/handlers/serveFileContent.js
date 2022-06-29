const fs = require('fs');
const path = require('path');

const getMimeType = (extension) => {
  const mimeTypes = {
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.css': 'text/css',
    '.pdf': 'application/pdf'
  };
  return mimeTypes[extension];
};

const createServeFileContent = (rootDir) => (request, response) => {
  let url = request.url.pathname;
  if (url === '/') {
    url = '/index.html';
  }

  const fileName = path.join(rootDir, url);
  try {
    const fileContent = fs.readFileSync(fileName);
    const extension = path.extname(fileName);
    response.setHeader('content-type', getMimeType(extension));
    response.end(fileContent);
  } catch (err) {
    return false;
  }
  return true;
};

module.exports = { createServeFileContent };
