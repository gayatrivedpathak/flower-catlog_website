const signupPageTemplate = () => {
  return `<html>
  <head>
    <title>Sign Up page</title>
    <script src="signup.js"></script>
  </head>
  <body>
      <header>
        <h2>Register</h2>
      </header>
      <form id="signup">
        <div>
          <label for="username">Username</label>
          <input type="text" name="username" id="username" placeholder="Enter name" required>
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Enter password" required>
        </div>
        <div id="message"> </div>
          <button id="signupBtn" value="SignUp">Sign up</button>
        <div id="login">
          <a href="/login">login</a>
        </div>
      </form>
  </body>
  </html>`
};

const isExistingUser = (users, newUsername) => {
  return users.find(({ username }) => username === newUsername);
};

const serveSignupPage = (request, response) => {
  response.setHeader('content-type', 'text/html');
  response.end(signupPageTemplate());
  return;
};

const signupUser = (users) => (request, response) => {
  const { body: { username, password } } = request;

  if (isExistingUser(users, username)) {
    response.status(409).end('User already exist');
    return;
  }

  users.push({ username, password });
  response.end('Successful');
};

module.exports = { signupUser, serveSignupPage };
