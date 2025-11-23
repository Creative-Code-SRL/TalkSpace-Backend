import { Server } from "socket.io";
import { MessageService } from "../services/messages.service.js";
import { verifyGoogleToken } from "../services/auth.service.js";

export const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
    connectionStateRecovery: {}
  });
  //nuevo
   io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("NO_AUTH_TOKEN"));
    }

    try {
      const user = await verifyGoogleToken(token);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("INVALID_GOOGLE_TOKEN"));
    }
  });

  io.on("connection", async (socket) => {
    //console.log("User connected");
    console.log("User connected:", socket.user.email);

    //socket.on("disconnect", () => console.log("User disconnected"));

    socket.on("chat message", async (msg) => {
      
      const username = socket.user.name;
      //const username = socket.handshake.auth.username || "anonymous";

      //const result = await MessageService.createMessage(msg, username);
      const result = await MessageService.createMessage(msg, username);
      io.emit("chat message", msg, result.id, username);
    });

    // Recuperación de mensajes
    if (!socket.recovered) {
      const lastId = socket.handshake.auth.serverOffset || 0;
      const rows = await MessageService.getMessagesSince(lastId);

      rows.forEach(row => {
        socket.emit("chat message", row.content, row.id, row.username);
      });
    }
  });
};
