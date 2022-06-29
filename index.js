const { startServer } = require("./src/server/server");
const { app } = require("./src/app");

startServer(4444, app());
