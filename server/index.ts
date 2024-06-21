import fastify, { FastifyRequest } from "fastify";
import websocket from "@fastify/websocket";

const server = fastify();
server.register(websocket);
const connectedClients = new Map();
server.register(async function (server) {
  // Define websocket routes
  server.get("/", { websocket: true }, (socket, req) => {
    // Defines a set of users connected to a certain roomId
    console.log(req.originalUrl);
    const params = new URLSearchParams(req.originalUrl);
    const roomId = params.get("/?roomId");

    if (!connectedClients.has(roomId)) {
      connectedClients.set(roomId, new Set());
    }
    connectedClients.get(roomId).add(socket);
    socket.on("message", (message) => {
      // Sends message to all clients but the sender
      connectedClients.get(roomId).forEach((client: any) => {
        if (client !== socket) {
          client.send(message.toString());
        }
      });
    });
  });
});

server.listen({ port: 10000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
