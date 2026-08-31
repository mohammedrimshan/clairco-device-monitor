import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import deviceRoutes from "./modules/device/device.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/devices", deviceRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Clairco Device Monitor API is running",
  });
});

export default app;