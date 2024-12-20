import { Server } from "socket.io";

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Listen for an event when a new order is placed
    socket.on("new-order", (orderData) => {
      console.log("New Order Received:", orderData);

      // Emit the order to all connected clients (e.g., admin panel)
      io.emit("order-update", orderData);
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

const emitOrderUpdate = (order) => {
  if (io) {
    io.emit("order-update", order);
  }
};

export { initializeSocket, emitOrderUpdate };
