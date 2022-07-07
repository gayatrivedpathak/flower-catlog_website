const fs = require('fs');

const timeStamp = () => {
  const d = new Date();
  const date = d.toDateString();
  const time = d.toLocaleTimeString();
  return `${date} ${time}`;
};

const updateGuestBook = (bodyParams, guestBook) => {
  const entries = bodyParams.entries();
  const entry = {};
  for (const [key, value] of entries) {
    entry[key] = value;
  }
  entry.date = timeStamp();
  guestBook.update(entry);
  fs.writeFileSync('./resources/comments.json', guestBook.comments);
};

const addComment = (request, response) => {
  const { guestBook, bodyParams } = request;
  updateGuestBook(bodyParams, guestBook);
  response.statusCode = 301;
  response.setHeader('location', '/guest-book');
  response.end();
  return true;
};

const createPage = (guestBook, template) => {
  const commentsHtml = guestBook.toHtml();
  return template.replace('__COMMENTS__', commentsHtml);
};

const serveGuestBook = (request, response) => {
  const { guestBook, template } = request;
  const guestBookPage = createPage(guestBook, template);

  response.setHeader('content-length', guestBookPage.length);
  response.setHeader('content-type', 'text/html');
  response.end(guestBookPage);
};

const createGuestBookHandler = (guestBook, guestBookTemplate) =>
  (request, response, next) => {
    const { url } = request;

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
