import fastify from "fastify";
import websocket from "@fastify/websocket";
const server = fastify();

server.register(websocket);
const clients = new Set<any>();
server.register(async function (server) {
  // Define websocket routes
  server.get("/", { websocket: true }, (socket, req) => {
    clients.add(socket);
    socket.on("message", (message) => {
      clients.forEach((client) => {
        // Send the message to the receiveing clients, omitting the sender
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
