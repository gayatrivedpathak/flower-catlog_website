const { startServer } = require("./src/server/server");
const { app } = require("./src/app");

const config = {
  serveFrom: './public',
  dataPath: './resources/comments.json'
};

startServer(4444, app(config));
