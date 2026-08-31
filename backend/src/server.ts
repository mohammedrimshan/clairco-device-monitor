import "dotenv/config";
import app from "./app.js";
import { startMqttService } from "./modules/mqtt/mqtt.service.js";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await startMqttService();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();