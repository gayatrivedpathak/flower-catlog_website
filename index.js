const { startServer } = require("./src/server/server");
const { app } = require("./src/app");

const config = {
  serveFrom: './public',
  dataPath: './data/comments.json',
};

const sessions = {};
const users = [
  { username: 'gayatri', password: '12345' },
  { username: 'ram', password: 'ram' }
];

startServer(4444, app(config, users, sessions));
