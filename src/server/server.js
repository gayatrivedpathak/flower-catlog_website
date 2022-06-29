const http = require('http');
const { URL } = require('url');

const startServer = (port, handler) => {
  const server = http.createServer((request, response) => {
    const { host } = request.headers;

    request.url = new URL(`http://${host}${request.url}`);
    console.log(request.method, request.url.pathname);

    handler(request, response);
  });

  server.listen(port, () => {
    console.log(`listening on ${server.address().port}`);
  });
};

module.exports = { startServer };
