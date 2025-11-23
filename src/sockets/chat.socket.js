// // chat.socket.js
// import { Server } from "socket.io";
// import { MessageService } from "../services/messages.service.js";

// export const setupChatSocket = (server) => {
//   const io = new Server(server, {
//     cors: { origin: "*" },
//     connectionStateRecovery: {},
//   });

//   io.on("connection", async (socket) => {
//     //  Guardamos username y offset del handshake
//     const username = socket.handshake.auth?.username || "anonymous";
//     socket.data.username = username;

//     socket.auth = {
//       username: username,
//       serverOffset: socket.handshake.auth.serverOffset || 0,
//     };

//     console.log(`User connected: ${username}`);

//     // Notificar a todos los demás (excepto el que se conectó) que un usuario se unió
//     socket.broadcast.emit('user joined', { username });

//     //  Evento de DESCONEXIÓN
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${username}`);
//       // Notificar a todos que el usuario se desconectó
//       socket.broadcast.emit('user left', { username });
//     });

//     //  Cuando el usuario manda un mensaje
//     socket.on("chat message", async (msg) => {
//       const username = socket.data.username;

//       const saved = await MessageService.createMessage(msg, username);

//       io.emit("chat message", {
//         id: saved.id,
//         username,
//         content: msg,
//       });
//     });

//     //  Recuperar mensajes perdidos si el cliente no está 'recovered'
//     if (!socket.recovered) {
//       const rows = await MessageService.getMessagesSince(socket.auth.serverOffset);

//       rows.forEach((row) => {
//         socket.emit("chat message", {
//           id: row.id,
//           username: row.username,
//           content: row.content,
//         });
//       });
//     }
//   });

//   return io;
// };
// chat.socket.js
import { Server } from "socket.io";
import { MessageService } from "../services/messages.service.js";

export const setupChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
    connectionStateRecovery: {},
  });

  io.on("connection", async (socket) => {
    //  Guardamos username y offset del handshake
    const username = socket.handshake.auth?.username || "anonymous";
    socket.data.username = username;

    socket.auth = {
      username: username,
      serverOffset: socket.handshake.auth.serverOffset || 0,
    };

    console.log(`✅ User connected: ${username}`);

    // ⚠️ IMPORTANTE: Notificar DESPUÉS de un pequeño delay para asegurar que el socket esté listo
    setTimeout(() => {
      socket.broadcast.emit('user joined', { username });
      console.log(`📢 Broadcast: ${username} joined`);
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

    //  Evento de DESCONEXIÓN
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${username}`);
      // Usar io.emit en lugar de socket.broadcast para asegurar que llegue
      io.emit('user left', { username });
      console.log(`📢 Broadcast: ${username} left`);
    });
  });

  return io;
};