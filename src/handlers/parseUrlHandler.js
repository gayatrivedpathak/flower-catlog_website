const parseUrlHandler = (request, response) => {
  const { host } = request.headers;
  request.url = new URL(`http://${host}${request.url}`);
  return false;
};
exports.parseUrlHandler = parseUrlHandler;
