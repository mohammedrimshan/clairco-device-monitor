import * as deviceRepository from "../device/device.repository.js";
import { sendOfflineAlert } from "../alert/alert.service.js";
import { emitDeviceUpdated } from "../socket/socket.service.js";
import { ENV } from "../../config/env.js";
import { DeviceStatus } from "../../enums/device-status.enum.js";

let isMonitoring = false;

export const startMonitoring = () => {
  const intervalMs = ENV.MONITORING_INTERVAL_MS;

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
        const isOffline = elapsedSeconds > device.expectedInterval;

        if (isOffline) {
          let updatedAlertSent = device.alertSent;

          if (!device.alertSent) {
            const emailSuccess = await sendOfflineAlert(device);
            if (emailSuccess) {
              updatedAlertSent = true;
            } else {
              console.warn(`Failed to send alert for device: ${device.deviceId}`);
            }
          }

          if (device.status !== DeviceStatus.OFFLINE || updatedAlertSent !== device.alertSent) {
            const updatedDevice = await deviceRepository.updateDeviceStatus(device.deviceId, {
              status: DeviceStatus.OFFLINE,
              lastSeenAt: device.lastSeenAt,
              alertSent: updatedAlertSent,
            });
            
            emitDeviceUpdated(updatedDevice);
          }
        }
      }
    } catch (error) {
      console.error("Monitoring check failed:", error);
    } finally {
      isMonitoring = false;
    }
  }, intervalMs);
};
