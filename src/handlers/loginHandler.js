const createSession = (username, password) => {
  const date = new Date();
  return { sessionId: date.getTime(), username, password };
};

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

const isValidUser = (users, username, password) => {
  return users.find((user) => {
    return user.username === username && password === user.password; ß
  });
};

const loginHandler = (sessions, users) => (request, response, next) => {
  const { method, url: { pathname }, bodyParams: { username, password } } = request;

  if (pathname === '/login' && method === 'POST') {
    const session = createSession(username, password);
    sessions[session.sessionId] = session;

    if (isValidUser(users, username, password)) {
      response.setHeader('set-cookie', `id=${session.sessionId}`);
      response.statusCode = 302;
      response.setHeader('location', '/guest-book');
      response.end();
      return;
    }
    const template = loginTemplate().replace('__MSG__', 'Enter valid username and password');
    response.setHeader('content-type', 'text/html');
    response.end(template);
    return;
  }

  if (pathname === '/login' && method === 'GET') {
    const template = loginTemplate().replace('__MSG__', '');
    response.setHeader('content-type', 'text/html');
    response.end(template);
    return;
  }
  next();
};

module.exports = { loginHandler };
