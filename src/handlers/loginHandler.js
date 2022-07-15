const loginTemplate = () => `<html>
<head>
  <title>Login page</title>
</head>
<body>
    <header>
      <h2>Login</h2>
    </header>
    <form action="/login" method="POST">
      <div>
        <label for="username">Username</label>
        <input type="text" name="username" id="name" placeholder="Enter username" required>
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" name="password" id="name" placeholder="Enter password" required>
      </div>
      <div class="login-button">
        <input type="submit" value="Login">
      </div>
    </form>
    <a href="/signup">
      <div class="signup-btn">Sign up</div>
    </a>

    <div>__MSG__</div>
</body>
</html>`;

const createSession = (username, password) => {
  const date = new Date();
  return { sessionId: date.getTime(), username, password };
};

const isValidUser = (users, username, password) => {
  return users.find((user) => {
    return user.username === username && password === user.password; ß
  });
};

const loginUser = (sessions, users) => (request, response) => {
  const { body: { username, password } } = request;

  const session = createSession(username, password);
  sessions[session.sessionId] = session;

  if (isValidUser(users, username, password)) {
    response.cookie(`id=${session.sessionId}`);
    response.location('/guest-book');
    response.status(302).end('Redirecting to /guest-book');
    return;
  }

  const template = loginTemplate().replace('__MSG__', 'Enter valid username and password');
  response.setHeader('content-type', 'text/html');
  response.status(401).end(template);
};

const serveLoginPage = (request, response) => {
  const template = loginTemplate().replace('__MSG__', '');
  response.setHeader('content-type', 'text/html');
  response.end(template);
  return;
};

module.exports = { loginUser, serveLoginPage };
