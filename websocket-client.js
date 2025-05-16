import WebSocket from "ws";
import readline from "readline";

// Configurar la interfaz de lectura desde la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new WebSocket("ws://localhost:8080");
let username = null;

client.on("open", () => {
  rl.question("Bienvenido al chat. Por favor, ingresa tu nombre de usuario: ", (name) => {
    username = name.trim();
    client.send(username);
    promptMessage(); // Comenzar a escuchar mensajes del usuario
  });
});

client.on("message", (data) => {
  console.log(data.toString());
});

client.on("close", () => {
  console.log("Conexión cerrada.");
  rl.close();
});

function promptMessage() {
  rl.question("", (msg) => {
    if (msg.trim() !== "") {
      client.send(msg.trim());
    }
    promptMessage(); // volver a esperar input
  });
}
