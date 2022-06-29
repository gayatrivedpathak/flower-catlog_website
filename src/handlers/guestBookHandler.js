const fs = require('fs');

const timeStamp = () => {
  const d = new Date();
  const date = d.toDateString();
  const time = d.toLocaleTimeString();
  return `${date} ${time}`;
};

const toHtml = ({ name, comment, date }) => {
  const nameHtml = `<td>${name}</td>`;
  const commentHtml = `<td>${comment}</td>`;
  const dateHtml = `<td>${date}</td>`;
  return `<tr>${dateHtml}${nameHtml}${commentHtml}</tr>`;
};

const generateCommentsHtml = (comments) => {
  if (!comments.length) {
    return '';
  }
  const commentsHtml = comments.map(toHtml).join('');
  return `<table class="comments">${commentsHtml}</table>`
};

const updateGuestBook = (searchParams, guestBook) => {
  const name = searchParams.get('name');
  const comment = searchParams.get('comment');
  if (name && comment) {
    guestBook.unshift({ name, comment, date: timeStamp() });
    fs.writeFileSync('./resources/comments.json', JSON.stringify(guestBook));
  }
};

const addComment = (request, response) => {
  const { guestBook, url: { searchParams } } = request;
  updateGuestBook(searchParams, guestBook);
  response.statusCode = 301;
  response.setHeader('location', '/guest-book');
  response.end();
  return true;
};

const createPage = (guestBook, template) => {
  const commentsHtml = generateCommentsHtml(guestBook);
  return template.replace('__COMMENTS__', commentsHtml);
};

const serveGuestBook = (request, response) => {
  const { guestBook, template } = request;
  const guestBookPage = createPage(guestBook, template);

  response.setHeader('content-length', guestBookPage.length);
  response.setHeader('content-type', 'text/html');
  response.end(guestBookPage);
  return true;
};

const guestBookHandler = (guestBook, guestBookTemplate) =>
  (request, response) => {
    const { url } = request;

    if (url.pathname === '/guest-book' && request.method === 'GET') {
      request.guestBook = guestBook;
      request.template = guestBookTemplate;
      return serveGuestBook(request, response);
    }

    if (url.pathname === '/add-comment' && request.method === 'GET') {
      request.guestBook = guestBook;
      return addComment(request, response);
    }
  };

module.exports = { guestBookHandler };
