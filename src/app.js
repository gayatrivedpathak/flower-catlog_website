const { createRouter } = require("./server/createRouter");
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFoundHandler } = require('./handlers/notFoundHandler.js');
const { createServeFileContent } = require('./handlers/serveFileContent.js');
const fs = require('fs');

const existingGuestBook = () => {
  const guestBook = fs.readFileSync('./resources/comments.json', 'utf-8')
  return guestBook.length ? JSON.parse(guestBook) : [];
};

const app = () => {
  const guestBookTemplate = fs.readFileSync('./resources/guest-book.html', 'utf-8');
  const guestBook = existingGuestBook();

  const router = createRouter(
    createServeFileContent('./public'),
    guestBookHandler(guestBook, guestBookTemplate),
    notFoundHandler
  );
  return router;
};

exports.app = app;
