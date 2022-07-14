const fs = require('fs');
const path = require('path');

const getMimeType = (extension) => {
  const mimeTypes = {
    '.html': 'text/html',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.css': 'text/css',
    '.pdf': 'application/pdf',
    '.js': 'text/javascript'
  };
  return mimeTypes[extension];
};

const filePath = (url, serveFrom) => {
  if (url === '/') {
    url = '/index.html';
  }
  return path.join(serveFrom, url);
};

const createServeFileContent = (serveFrom) => (request, response, next) => {
  if (request.method !== 'GET') {
    next();
  }
  const url = request.url.pathname;
  const fileName = filePath(url, serveFrom);
  fs.readFile(fileName, (err, fileContent) => {
    if (err) {
      next();
      return;
    }
    const extension = path.extname(fileName);
    response.setHeader('content-type', getMimeType(extension));
    response.end(fileContent);
  });
};

module.exports = { createServeFileContent };
