const fs = require('fs');

const timeStamp = () => {
  return new Date().toString();
};

const generateCommentsHtml = (comments) => {
  if (!comments.length) {
    return '';
  }
  return JSON.stringify(comments);
};

const getOldComment = () => {
  const comments = fs.readFileSync('./comments.json', 'utf-8')
  return comments.length ? JSON.parse(comments) : [];
};

const handleGuestBook = ({ queryParams }, response) => {
  const { name, comment } = queryParams;
  const rawTemplate = fs.readFileSync('./public/guest-book.html', 'utf-8');
  const comments = getOldComment();
  if (name && comment) {
    comments.push({ name, comment, date: timeStamp() });
  }
  const commentsHtml = generateCommentsHtml(comments);
  fs.writeFileSync('./comments.json', JSON.stringify(comments));
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
