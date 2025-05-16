import WebSocket from "ws";

// Pedir el nombre de usuario al iniciar
const username = prompt("Bienvenido al chat. Por favor, ingresa tu nombre de usuario:");

const client = new WebSocket("ws://localhost:8080");

client.on("open", () => {
  client.send(username);
  console.log(`Conectado al chat como "${username}".`);

  // Bucle para enviar mensajes desde la terminal
  (async function chatLoop() {
    while (true) {
      const msg = prompt("");
      if (!msg) continue;
      client.send(msg);
    }
  })();
});

// ✅ Este bloque es clave: mostrar todos los mensajes que llegan
client.on("message", (data) => {
  console.log(data.toString());
});

client.on("close", () => {
  console.log("Conexión cerrada.");
});
