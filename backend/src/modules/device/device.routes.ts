import { Router } from "express";
import * as deviceController from "./device.controller.js";

const router = Router();

router.post("/", deviceController.createDevice);
router.get("/", deviceController.getAllDevices);
router.get("/:id", deviceController.getDeviceById);
router.patch("/:id", deviceController.updateDevice);
router.delete("/:id", deviceController.deleteDevice);

export default router;
