import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(socketUrl, {
  autoConnect: true,
  reconnection: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});
