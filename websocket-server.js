import { WebSocketServer } from "ws";

// Crear un servidor WebSocket
const server = new WebSocketServer({ port: 8080 });
const clients = new Map(); // Map para guardar usuarios por socket

console.log("Servidor WebSocket ejecutándose en ws://localhost:8080");

// Manejar nuevas conexiones
server.on("connection", (socket) => {
  console.log("Cliente conectado.");

   let username = null;

  socket.send("Bienvenido al chat. Por favor, envía tu nombre de usuario:");

  socket.on("message", (message) => {
    const msg = message.toString();

    if (!username) {
      username = msg;
      clients.set(socket, username);
      socket.send(`Conectado al chat como "${username}".`);
      console.log(`Usuario conectado: ${username}`);
      broadcast(`${username} se ha unido al chat.`, socket);
    } else {
      broadcast(`${username}: ${msg}`, socket);
    }
  });

  socket.on("close", () => {
    if (username) {
      console.log(`${username} se ha desconectado.`);
      clients.delete(socket);
      broadcast(`${username} ha salido del chat.`, socket);
    }
  });
});

function broadcast(message, exceptSocket) {
  for (const [client] of clients.entries()) {
    if (client !== exceptSocket && client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}
