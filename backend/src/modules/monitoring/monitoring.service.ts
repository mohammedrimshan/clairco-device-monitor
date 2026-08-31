import * as deviceRepository from "../device/device.repository.js";

let isMonitoring = false;

export const startMonitoring = () => {
  const intervalMs = process.env.MONITORING_INTERVAL_MS
    ? parseInt(process.env.MONITORING_INTERVAL_MS, 10)
    : 5000;

  setInterval(async () => {
    if (isMonitoring) {
      return;
    }

    isMonitoring = true;

    try {
      const devices = await deviceRepository.findAllDevices();
      const now = new Date().getTime();

      for (const device of devices) {
        if (!device.lastSeenAt) {
          continue;
        }

        const elapsedSeconds = (now - device.lastSeenAt.getTime()) / 1000;

        if (
          elapsedSeconds > device.expectedInterval &&
          device.status !== "OFFLINE"
        ) {
          await deviceRepository.updateDeviceStatus(device.deviceId, {
            status: "OFFLINE",
            lastSeenAt: device.lastSeenAt,
          });
        }
      }
    } catch (error) {
      console.error("Monitoring check failed:", error);
    } finally {
      isMonitoring = false;
    }
  }, intervalMs);
};
