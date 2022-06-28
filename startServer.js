const { startServer } = require("./src/server");
const { guestBookHandler } = require('./src/guestBookHandler.js');
const { notFoundHandler } = require('./src/notFoundHandler.js');
const { serveFileContent } = require('./src/serveFileContent.js');

const createHandler = (handlers) => {
  return (request, response, rootDir) => {
    for (const handler of handlers) {
      if (handler(request, response, rootDir)) {
        return true;
      }
    }
    return false;
  }
};

const rootDir = process.argv[2];

const handlers = [serveFileContent, guestBookHandler, notFoundHandler];

startServer(createHandler(handlers), rootDir);
