import http from "http";
import app from "./app.js";
import { setupChatSocket } from "./sockets/chat.socket.js";

const server = http.createServer(app);
setupChatSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
