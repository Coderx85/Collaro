import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle)
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    socket.on("join-room", ({roomId, userId}) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      socket.to(roomId).emit("user_joined", `🔔 ${userId} joined room ${roomId}`);
    })

    socket.on("message", ({sender, room, message}) => {
      console.log(`Message from ${sender} in room ${room}: ${message}`);
      socket.to(room).emit("message", {sender, message});
    })
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    })
  })

  
  httpServer.listen(port, () => {
    console.log(`Server is running on https://${hostname}:${port}`)
  })
})