const bodyParamsParser = (request, response, next) => {
  let data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });

  request.on('end', () => {
    const bodyParams = new URLSearchParams(data);
    request.bodyParams = bodyParams;
    next();
  });
};
exports.bodyParamsParser = bodyParamsParser;
