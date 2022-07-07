const signupPageTemplate = () => {
  return `<html>
  <head>
    <title>Sign Up page</title>
  </head>
  <body>
      <header>
        <h2>Register</h2>
      </header>
      <form action="/signup" method="POST">
        <div>
          <label for="username">Username</label>
          <input type="text" name="username" id="name" placeholder="Enter name" required>
        </div>
        <div>
        <label for="password">Password</label>
        <input type="password" name="password" id="name" placeholder="Enter password" required>
      </div>
        <div class="signup-button">
          <input type="submit" value="SignUp">
        </div>
      </form>
  </body>
  </html>`
};

const signupHandler = (users) => (request, response, next) => {
  const { url: { pathname }, method, bodyParams: { username, password } } = request;

  if (method === 'GET' && pathname === '/signup') {
    response.setHeader('content-type', 'text/html');
    response.end(signupPageTemplate());
    return;
  }

  if (method === 'POST' && pathname === '/signup') {
    users.push({ username, password });
    response.statusCode = 302;
    response.setHeader('location', '/login');
    response.end();
    return;
  }
  next();
};

module.exports = { signupHandler };
