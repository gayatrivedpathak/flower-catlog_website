const bodyParamsParser = (request, response, next) => {
  let data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });

  request.on('end', () => {
    const bodyParams = new URLSearchParams(data);
    const entries = bodyParams.entries();
    const entry = {};
    for (const [key, value] of entries) {
      entry[key] = value;
    }
    request.bodyParams = entry;
    next();
  });
};
exports.bodyParamsParser = bodyParamsParser;
