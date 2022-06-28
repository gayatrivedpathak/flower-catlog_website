const notFoundHandler = ({ uri }, response) => {
  response.statusCode = 404;
  response.send('Not Found');
};
exports.notFoundHandler = notFoundHandler;
