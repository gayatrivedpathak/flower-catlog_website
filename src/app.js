const fs = require('fs');
const { createRouter } = require("./server/createRouter");
const { createGuestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFoundHandler } = require('./handlers/notFoundHandler.js');
const { createServeFileContent } = require('./handlers/serveFileContent.js');
const { parseUrlHandler } = require("./handlers/parseUrlHandler");
const { waitForDebugger } = require('inspector');

const loadGuestBook = (dataPath) => {
  const guestBook = fs.readFileSync(dataPath, 'utf-8');
  return guestBook.length ? JSON.parse(guestBook) : [];
};

const app = ({ serveFrom, dataPath }) => {
  const guestBookTemplate = fs.readFileSync('./resources/guest-book.html', 'utf-8');
  const guestBook = loadGuestBook(dataPath);
  const guestBookHandler = createGuestBookHandler(guestBook, guestBookTemplate);
  const serveFileContent = createServeFileContent(serveFrom);

  const router = createRouter(
    parseUrlHandler,
    serveFileContent,
    guestBookHandler,
    notFoundHandler
  );
  return router;
};

exports.app = app;
