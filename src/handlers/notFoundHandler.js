const notFoundHandler = (request, response) => {
  response.statusCode = 404;
  response.end('Not Found');
};

exports.notFoundHandler = notFoundHandler;
