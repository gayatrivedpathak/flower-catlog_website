const createSession = (username) => {
  const date = new Date();
  return { sessionId: date.getTime(), username };
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
        <input type="text" name="username" id="name" placeholder="Enter name" required>
      </div>
      <div class="login-button">
        <input type="submit" value="Login">
      </div>
    </form>
</body>
</html>`;

const loginHandler = (sessions) => (request, response, next) => {
  const { method, url: { pathname }, bodyParams: { username } } = request;

  if (pathname === '/login' && method === 'POST') {
    const session = createSession(username);
    sessions[session.sessionId] = session;

    response.setHeader('set-cookie', `id=${session.sessionId}`);
    response.statusCode = 302;
    response.setHeader('location', '/guest-book');
    response.end();
    return;
  }

  if (pathname === '/login' && method === 'GET') {
    response.setHeader('content-type', 'text/html');
    response.end(loginTemplate());
    return;
  }
  next();
};

module.exports = { loginHandler };
