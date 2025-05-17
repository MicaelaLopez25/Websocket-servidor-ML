import chalk from "chalk";
import { WebSocketServer } from "ws";
import readline from "readline";

// Crear un servidor WebSocket
const server = new WebSocketServer({ port: 8080 });
const clients = new Map(); // Map para guardar usuarios por socket

console.log(chalk.magenta("Servidor WebSocket ejecutándose en ws://localhost:8080"));

// Manejar nuevas conexiones
server.on("connection", (socket) => {
  console.log("Cliente conectado.");

   let username = null;

  socket.send("Bienvenido al chat. Por favor, envía tu nombre de usuario:");

  socket.on("message", (message) => {
    const msg = message.toString().trim();

    if (!username) {
      username = msg;
      clients.set(socket, username);
socket.send(`Conectado al chat como "${username}".`);
console.log(`Usuario conectado: ${username}`);
broadcast(`${username} se ha unido al chat.`, socket); // <- OMITIR al propio socket


      return;
    }
    console.log(`${username} dijo: ${msg}`); // esto imprime el mjs en el servidor sjfsj
    broadcast(`${username}: ${msg}`);
 //   console.log(chalk.pink('servidor: el servidor se apagara en 20 minutos'));
    
  });
  
  server.on("message", (data) => {
  console.log(chalk.green(data.toString()))
});

  socket.on("close", () => {
    if (username) {
      console.log(`servidor: ${username} se ha desconectado.`);
      clients.delete(socket);
      broadcast(`${username} ha salido del chat.`);
    }
  });
});

function broadcast(message, omitSocket = null) {
  for (const [client] of clients) {
    if (client !== omitSocket && client.readyState === client.OPEN) {
      client.send(message);
    }
  }
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.magenta("servidor> ")
});

rl.prompt();

rl.on("line", (input) => {
  const message = input.trim();
  if (message) {
    console.log(chalk.magenta(`servidor (tú): ${message}`));
    broadcast(chalk.magenta(`💬 Servidor: ${message}`));
  }
  rl.prompt();
});