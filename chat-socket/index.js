require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const server = http.createServer(app);

const { Server } = require("socket.io");

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_HOST,
    methods: ["GET", "POST"],
  },
});

console.log("env", process.env.CLIENT_HOST)

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("add_active_user", (userId) => {
    addUser(userId, socket.id);
    io.emit("get_active_user", users);
  });

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User with ID: ${socket.id} joined room: ${conversationId}`);
  });

  // Listen typing events
  socket.on("start_typing_message", (data) => {
    io.to(data.conversationId).emit("start_typing_message", data);
  });

  socket.on("stop_typing_message", (data) => {
    io.to(data.conversationId).emit("stop_typing_message", data);
  });

  // Listen send message
  socket.on("send_message", async (data) => {
    console.log("data", data)
    io.to(data.conversationId).emit("receive_message", data);
  }); 

  // Listen alert new message in conversation
  socket.on("listen_message_change", (data) => {
    io.emit("get_new_conversation_change", data);
  });

  // Listen disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    removeUser(socket.id);
    io.emit("filter_disconnect_user", users);
  });
});

const PORT = 8900;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
