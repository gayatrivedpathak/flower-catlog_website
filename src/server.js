const { createServer } = require('net');
const { parseRequest } = require('./parseRequest.js');
const { Response } = require('./response.js');

const onNewConnection = (socket, handler, rootDir) => {
  socket.on('error', (err) => console.error(err.message));
  socket.on('data', (chunk) => {
    const request = parseRequest(chunk.toString());
    console.log(new Date(), request.method, request.uri, request.queryParams);

    const response = new Response(socket);
    handler(request, response, rootDir);
  });
};

const startServer = (handler, rootDir) => {
  const server = createServer((socket) => {
    onNewConnection(socket, handler, rootDir);
  });

  const PORT = 4444;
  server.listen(PORT, () => console.log(`listening on ${PORT}`));
};

module.exports = { onNewConnection, startServer };
