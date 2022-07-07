const fs = require('fs');
const { createRouter } = require("./server/createRouter");
const { createGuestBookHandler } = require('./handlers/guestBookHandler.js');
const { notFoundHandler } = require('./handlers/notFoundHandler.js');
const { createServeFileContent } = require('./handlers/serveFileContent.js');
const { searchParamsParser } = require("./handlers/parseUrlHandler");
const { GuestBook } = require('./handlers/GuestBook');
const { createApiHandler } = require("./handlers/createApiHandler");
const { bodyParamsParser } = require("./handlers/bodyParamsParser");
const { injectSession } = require('./handlers/sessionHandler');
const { loginHandler } = require('./handlers/loginHandler');
const { injectCookies } = require('./handlers/injectCookies');
const { logoutHandler } = require('./handlers/logoutHandler');
const { signupHandler } = require('./handlers/signupHandler');


const loadGuestBook = (dataPath) => {
  const guestBook = fs.readFileSync(dataPath, 'utf-8');
  return guestBook.length ? JSON.parse(guestBook) : [];
};

const logRequest = (request, response, next) => {
  console.log(request.method, request.url.pathname);
  next();
};

const app = ({ serveFrom, dataPath }) => {
  const guestBookTemplate = fs.readFileSync('./resources/guest-book.html', 'utf-8');
  const comments = loadGuestBook(dataPath);
  const guestBook = new GuestBook(comments);
  const guestBookHandler = createGuestBookHandler(guestBook, guestBookTemplate);
  const apiHandler = createApiHandler(guestBook);
  const serveFileContent = createServeFileContent(serveFrom);

  const sessions = {};

  const users = [
    { username: 'gayatri', password: '12345' },
    { username: 'ram', password: 'ram' }
  ];

  const router = createRouter(
    searchParamsParser,
    logRequest,
    bodyParamsParser,
    injectCookies,
    injectSession(sessions),
    loginHandler(sessions, users),
    signupHandler(users),
    logoutHandler(sessions),
    apiHandler,
    serveFileContent,
    guestBookHandler,
    notFoundHandler
  );
  return router;
};

exports.app = app;
