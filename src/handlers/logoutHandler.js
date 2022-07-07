const logoutHandler = (sessions) => (request, response, next) => {
  const { url: { pathname }, method } = request;

  if (pathname === '/logout' && method === 'GET') {
    request.session = {};
    delete sessions[request.session.sessionId];

    response.setHeader('set-cookie', `id=${request.session.sessionId};max-age=0`);
    response.setHeader('location', '/');
    response.statusCode = 302;
    response.end();
  }
  next();
};

module.exports = { logoutHandler };
