const fs = require('fs');

const serveFileContent = ({ uri }, response, rootDir) => {
  if (!rootDir) {
    rootDir = './public';
  }

  if (uri === '/') {
    uri = '/index.html';
  }

  let fileName = rootDir + uri;
  console.log(fileName);
  if (!fs.existsSync(fileName)) {
    return false;
  }

  const fileContent = fs.readFileSync(fileName);
  response.send(fileContent);
  return true;
};

module.exports = { serveFileContent };
