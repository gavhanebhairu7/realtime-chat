import express from "express";
import http from "http";
import { Server } from "socket.io";

// Express server is base
const app = express();

// Socket server is placed on top of HTTP server
const server = http.createServer(app);

// io is the instance of socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const onlineUserIds = {};

// Listen for new connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  //emmit message to all that I am connected
  const userId = socket.handshake.query.userId;
  onlineUserIds[userId] = socket.id;
  io.emit("getonline", Object.keys(onlineUserIds));
  // Listen for the disconnect event for the current socket
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    delete onlineUserIds[userId];
    io.emit("getonline", Object.keys(onlineUserIds));
    //emmit message to all users that I am gone
  });
});

export { app, server, io, onlineUserIds };
