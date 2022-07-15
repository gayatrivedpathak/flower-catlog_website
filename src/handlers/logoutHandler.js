const logoutHandler = (sessions) => (request, response) => {
  const { cookies } = request;

  request.session = {};
  delete sessions[cookies.id];
  response.clearCookie(`id=${cookies.id}`);

  response.location('/');
  response.status(302).end();
};

module.exports = { logoutHandler };
