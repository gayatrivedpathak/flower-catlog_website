const { startServer, handle } = require("./src/server");

const rootDir = process.argv[2];
console.log('rootDir', rootDir);
startServer(handle, rootDir);
