import { Server } from "socket.io";
import { MessageService } from "../services/messages.service.js";

export const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
    connectionStateRecovery: {}
  });

  io.on("connection", async (socket) => {
    console.log("User connected");

    socket.on("disconnect", () => console.log("User disconnected"));

    socket.on("chat message", async (msg) => {
      const username = socket.handshake.auth.username || "anonymous";

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
