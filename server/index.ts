import fastify from "fastify";
import websocket from "@fastify/websocket";
const server = fastify();

server.register(websocket);

server.register(async function (server) {
  // Define websocket routes
  server.get("/", { websocket: true }, (socket, req) => {
    socket.on("message", (message) => {
      console.log(message.toString());
      socket.send("hi from server" + new Date());
    });
    socket.send("The conversation started!");
  });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
