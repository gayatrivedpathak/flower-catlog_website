const fs = require('fs');
const express = require('express');
const { GuestBook } = require('./GuestBook');

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
  fs.writeFileSync('./data/comments.json', guestBook.comments);
  return entry;
};

const addComment = (request, response) => {
  const { guestBook, body: { comment } } = request;

  if (!comment) {
    response.status(400).end();
    return;
  }

  const username = request.session.username;
  const entry = updateGuestBook(guestBook, username, comment);
  response.setHeader('content-type', 'text/plain');
  response.status(201).end('Comment saved');
  return;
};

const createPage = (guestBook, template, username) => {
  const commentsHtml = guestBook.toHtml();
  return template
    .replace('__COMMENTS__', commentsHtml)
    .replace('__NAME__', username.toUpperCase());
};

const serveGuestBook = (request, response) => {
  const { template, guestBook, session } = request;

  const username = session.username;
  const guestBookPage = createPage(guestBook, template, username);

  response.setHeader('content-length', guestBookPage.length);
  response.setHeader('content-type', 'text/html');

  response.end(guestBookPage);
};

const hasLoggedIn = (request, response, next) => {
  if (!request.session) {
    response.redirect('/login');
    response.status(302).end();
    return;
  }
  next();
};

const serveCommentsApi = (request, response) => {
  const api = request.guestBook.comments;
  response.setHeader('content-type', 'application/json');
  response.setHeader('content-length', api.length);
  response.end(api);
  return;
};

const readText = (filePath) => fs.readFileSync(filePath, 'utf8');

const loadGuestBook = (dataPath) => {
  const guestBook = fs.readFileSync(dataPath, 'utf-8');
  return guestBook.length ? JSON.parse(guestBook) : [];
};

const createGuestBookRouter = (dataPath, guestBookTemplatePath) => {
  const template = readText(guestBookTemplatePath);
  const comments = loadGuestBook(dataPath);
  const guestBook = new GuestBook(comments);

  const guestBookRouter = express.Router();
  guestBookRouter.use((request, response, next) => {
    request.guestBook = guestBook;
    request.template = template;
    next();
  });

  guestBookRouter.get('/', hasLoggedIn, serveGuestBook);
  guestBookRouter.post('/add-comment', addComment);
  guestBookRouter.get('/api', serveCommentsApi);

  return guestBookRouter;
};

module.exports = { createGuestBookRouter };
