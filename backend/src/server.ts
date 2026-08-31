import "dotenv/config";
import app from "./app.js";
import { startMqttService } from "./modules/mqtt/mqtt.service.js";
import { startMonitoring } from "./modules/monitoring/monitoring.service.js";
import { initSocket } from "./modules/socket/socket.service.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await startMqttService();
  startMonitoring();

  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  initSocket(server);
};

startServer();