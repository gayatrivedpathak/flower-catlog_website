const { startServer } = require("./src/server/server");
const { router } = require("./src/app");

startServer(4444, router);
