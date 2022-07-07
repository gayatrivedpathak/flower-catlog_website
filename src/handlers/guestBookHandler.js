const fs = require('fs');

const timeStamp = () => {
  const d = new Date();
  const date = d.toDateString();
  const time = d.toLocaleTimeString();
  return `${date} ${time}`;
};

const updateGuestBook = (guestBook, username, comment) => {
  const entry = { username, comment };
  entry.date = timeStamp();
  guestBook.update(entry);
  fs.writeFileSync('./resources/comments.json', guestBook.comments);
};

const addComment = (request, response) => {
  const { guestBook, bodyParams: { comment } } = request;
  const username = request.session.username;
  updateGuestBook(guestBook, username, comment);
  response.statusCode = 301;
  response.setHeader('location', '/guest-book');
  response.end();
  return true;
};

const createPage = (guestBook, template, username) => {
  const commentsHtml = guestBook.toHtml();
  return template.replace('__COMMENTS__', commentsHtml).replace('__NAME__', username.toUpperCase());
};

const serveGuestBook = (request, response) => {
  const { guestBook, template } = request;
  const username = request.session.username;
  const guestBookPage = createPage(guestBook, template, username);

  response.setHeader('content-length', guestBookPage.length);
  response.setHeader('content-type', 'text/html');
  response.end(guestBookPage);
};

const createGuestBookHandler = (guestBook, guestBookTemplate) =>
  (request, response, next) => {
    const { url } = request;

    if (!request.session && (url.pathname === '/add-comment' || url.pathname === '/guest-book')) {
      response.statusCode = 302;
      response.setHeader('location', '/login');
      response.end();
      return;
    }

    if (url.pathname === '/guest-book' && request.method === 'GET') {
      request.guestBook = guestBook;
      request.template = guestBookTemplate;
      serveGuestBook(request, response);
      return;
    }

    if (url.pathname === '/add-comment' && request.method === 'POST') {
      request.guestBook = guestBook;
      addComment(request, response);
      return;
    }
    next();
  };

module.exports = { createGuestBookHandler };
