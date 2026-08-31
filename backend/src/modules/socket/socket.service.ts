import { Server as SocketIOServer } from "socket.io";
import type { Server as HttpServer } from "http";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });
};

export const emitDeviceUpdated = (deviceData: unknown) => {
  if (!io) {
    return;
  }

  try {
    io.emit("device:updated", deviceData);
  } catch (error) {
    console.error("Failed to emit device:updated event over Socket.IO", error);
  }
};
