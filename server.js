const http = require("http");
const app = require("./src/app");

app.set("port", process.env.APP_PORT);
const server = http.createServer(app);

server.listen(process.env.APP_PORT);
