const injectSession = (sessions) => (request, response, next) => {
  const { id } = request.cookies;
  if (!sessions[id] && !request.cookies.id) {
    next();
    return;
  }

  request.session = sessions[id];
  next();
};


module.exports = { injectSession };
