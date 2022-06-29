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
  const commentsHtml = comments.reverse().map(toHtml).join('');
  return `<table class="comments">${commentsHtml}</table>`
};

const handleGuestBook = (request, response) => {
  console.log(request.url.searchParams);
  const { guestBook, url: { searchParams } } = request;

  const name = searchParams.get('name');
  const comment = searchParams.get('comment');

  const rawTemplate = fs.readFileSync('./resources/guest-book.html', 'utf-8');
  if (name && comment) {
    guestBook.push({ name, comment, date: timeStamp() });
    fs.writeFileSync('./resources/comments.json', JSON.stringify(guestBook));
  }

  const commentsHtml = generateCommentsHtml(guestBook);
  const template = rawTemplate.replace('__COMMENTS__', commentsHtml);
  response.end(template);
  return true;
};

const guestBookHandler = (guestBook) => (request, response) => {
  const { url } = request;
  if (url.pathname === '/guest-book' && request.method === 'GET') {
    request.guestBook = guestBook;
    return handleGuestBook(request, response);
  }
};

module.exports = { guestBookHandler };
