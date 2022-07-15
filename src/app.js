const fs = require('fs');
const express = require('express');

const { createGuestBookRouter } = require('./handlers/guestBookHandler.js');
// const { GuestBook } = require('./handlers/GuestBook');
const { injectSession } = require('./handlers/sessionHandler');
const { loginUser, serveLoginPage } = require('./handlers/loginHandler');
const { injectCookies } = require('./handlers/injectCookies');
const { logoutHandler } = require('./handlers/logoutHandler');
const { signupUser, serveSignupPage } = require('./handlers/signupHandler');



const logRequest = (request, response, next) => {
  console.log(request.method, request.url);
  next();
};

const createApp = (config, users, sessions) => {
  const { guestBookTemplatePath, dataPath, serveFrom } = config;
  const app = express();

  const guestBookRouter = createGuestBookRouter(dataPath, guestBookTemplatePath);

  app.use(logRequest);
  app.use(express.urlencoded({ extended: true }));
  app.use(injectCookies);
  app.use(injectSession(sessions));

  app.use(express.static(serveFrom));

  app.use('/guest-book', guestBookRouter);

  const loginRouter = express.Router();
  loginRouter.get('/', serveLoginPage);
  loginRouter.post('/', loginUser(sessions, users));

  app.use('/login', loginRouter);

  const signupRouter = express.Router();
  signupRouter.get('/', serveSignupPage);
  signupRouter.post('/', signupUser(users));

  app.use('/signup', signupRouter);
  app.get('/logout', logoutHandler(sessions));

  return app;
};

exports.createApp = createApp;
