const notFoundHandler = (request, response) => {
  response.statusCode = 404;
  response.end('Not Found');
  return;
};

exports.notFoundHandler = notFoundHandler;
