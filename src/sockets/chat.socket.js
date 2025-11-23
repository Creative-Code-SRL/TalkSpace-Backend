// chat.socket.js
import { Server } from "socket.io";
import { MessageService } from "../services/messages.service.js";

export const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
    connectionStateRecovery: {},
  });

  io.on("connection", async (socket) => {
    console.log("User connected");

    //  Guardamos username y offset del handshake
    socket.auth = {
      username: socket.handshake.auth.username || "anonymous",
      serverOffset: socket.handshake.auth.serverOffset || 0,
    };

    //  Evento de DESCONEXIÓN
    socket.on("disconnect", () => console.log("User disconnected"));

    //  Cuando el usuario manda un mensaje
    socket.on("chat message", async (msg) => {
      const username = socket.auth.username;

      const saved = await MessageService.createMessage(msg, username);

      io.emit("chat message", {
        id: saved.id,
        username,
        content: msg,
      });
    });

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
  });

  return io;
};
