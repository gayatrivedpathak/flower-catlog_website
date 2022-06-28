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

const getOldComments = () => {
  const comments = fs.readFileSync('./comments.json', 'utf-8')
  return comments.length ? JSON.parse(comments) : [];
};

const handleGuestBook = ({ queryParams }, response) => {
  const { name, comment } = queryParams;
  const rawTemplate = fs.readFileSync('./public/guest-book.html', 'utf-8');
  const comments = getOldComments();
  if (name && comment) {
    comments.push({ name, comment, date: timeStamp() });
    fs.writeFileSync('./comments.json', JSON.stringify(comments));
  }
  const commentsHtml = generateCommentsHtml(comments);
  const template = rawTemplate.replace('__COMMENTS__', commentsHtml);
  response.send(template);
};

const guestBookHandler = (request, response) => {
  const { uri } = request;
  if (uri === '/guest-book') {
    return handleGuestBook(request, response);
  }
};

module.exports = { guestBookHandler };
