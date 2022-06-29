const { createRouter } = require("./server/createRouter");
const { guestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFoundHandler } = require('./handlers/notFoundHandler.js');
const { createServeFileContent } = require('./handlers/serveFileContent.js');
const fs = require('fs');

const getOldComments = () => {
  const guestBook = fs.readFileSync('./resources/comments.json', 'utf-8')
  return guestBook.length ? JSON.parse(guestBook) : [];
};

const guestBook = getOldComments();

const router = createRouter(
  createServeFileContent('./public'),
  guestBookHandler(guestBook),
  notFoundHandler
);

exports.router = router;
