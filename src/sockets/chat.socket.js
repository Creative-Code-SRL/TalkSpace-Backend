import { Server } from "socket.io";
import { MessageService } from "../services/messages.service.js";

export const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
    connectionStateRecovery: {},
  });

  io.on("connection", async (socket) => {
    const username = socket.handshake.auth?.username || "anonymous";
    socket.data.username = username;

    socket.auth = {
      username: username,
      serverOffset: socket.handshake.auth.serverOffset || 0,
    };
    setTimeout(() => {
      socket.broadcast.emit('user joined', { username });
    }, 100);

    //  Recuperar mensajes perdidos si el cliente no está 'recovered'
    if (!socket.recovered) {
      const rows = await MessageService.getMessagesSince(socket.auth.serverOffset);

      rows.forEach((row) => {
        socket.emit("chat message", {
          id: row.id,
          username: row.username,
          content: row.content,
        });
      });
    }

    //  Cuando el usuario manda un mensaje
    socket.on("chat message", async (msg) => {
      const username = socket.data.username;

      const saved = await MessageService.createMessage(msg, username);

      io.emit("chat message", {
        id: saved.id,
        username,
        content: msg,
      });
    });
    socket.on("disconnect", () => {
      io.emit('user left', { username });
    });
  });

  return io;
};