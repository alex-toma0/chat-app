import fastify, { FastifyRequest } from "fastify";
import websocket from "@fastify/websocket";

const server = fastify();
server.register(websocket);
const connectedClients = new Map();
server.register(async function (server) {
  // Define websocket routes
  server.get("/", { websocket: true }, (socket, req) => {
    // Defines a set of users connected to a certain roomId
    const params = new URLSearchParams(req.originalUrl);
    const roomId = params.get("/?roomId");
    const clientId = params.get("clientId");
    if (!connectedClients.has(roomId)) {
      connectedClients.set(roomId, {
        occupancy: 0,
        clients: new Map(),
      });
    }
    const room = connectedClients.get(roomId);
    if (room.occupancy >= 4 && !room.clients.has(clientId)) {
      // Reject connection if room is full, and a new client is trying to join it
      socket.send("Server message: room is full!");
      socket.close();
      return;
    }
    room.clients.set(clientId, socket);
    room.occupancy++;
    socket.on("message", (message) => {
      // Sends message to all clients but the sender
      room.clients.forEach((clientSocket: any, clientId: any) => {
        if (clientSocket !== socket) {
          clientSocket.send(message.toString());
        }
      });
    });
    socket.on("close", () => {
      console.log("WebSocket has closed");
      // Removes the client from the room after websocket is closed
      room.clients.delete(clientId);
      room.occupancy--;
      // If room is empty, delete the room
      if (room.occupancy === 0 && room.clients.size === 0) {
        connectedClients.delete(roomId);
      }
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
