const searchParamsParser = (request, response, next) => {
  const { host } = request.headers;
  request.url = new URL(`http://${host}${request.url}`);
  next();
};

exports.searchParamsParser = searchParamsParser;
