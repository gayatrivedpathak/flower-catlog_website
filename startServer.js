const { startServer } = require("./src/server");
const { guestBookHandler } = require('./src/guestBookHandler.js');
const { notFoundHandler } = require('./src/notFoundHandler.js');
const { createServeFileContent } = require('./src/serveFileContent.js');

const createRouter = (...handlers) => (request, response) => {
  for (const handler of handlers) {
    if (handler(request, response)) {
      return true;
    }
  }
  return false;
};

startServer(createRouter(
  createServeFileContent('./public'),
  guestBookHandler,
  notFoundHandler
));
