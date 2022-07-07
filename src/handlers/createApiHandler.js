const createApiHandler = (guestBook) => (request, response, next) => {
  if (request.url.pathname === '/api' && request.method === 'GET') {
    const api = guestBook.comments;
    response.setHeader('content-type', 'application/json');
    response.setHeader('content-length', api.length);
    response.end(api);
    return true;
  }
  next();
};

exports.createApiHandler = createApiHandler;
