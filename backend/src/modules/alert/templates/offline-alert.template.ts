import type { AlertDevice } from "../alert.types.js";

export interface AlertEmailContent {
  subject: string;
  text: string;
  html: string;
}

export const createOfflineAlertTemplate = (
  device: AlertDevice
): AlertEmailContent => {
  const lastSeen = device.lastSeenAt
    ? device.lastSeenAt.toISOString()
    : "Never";

  return {
    subject: `🔴 ALERT: Device ${device.name} is OFFLINE`,

    text: `Hello,

Your device is currently OFFLINE.

Device Details:
- Device Name: ${device.name}
- Device ID: ${device.deviceId}
- Status: OFFLINE
- Last Seen: ${lastSeen}
- Expected Interval: ${device.expectedInterval} seconds

Please check the device connection.

Clairco Device Monitor`,

    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #eff6ff; padding: 32px 16px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <div style="background-color: #1d4ed8; padding: 24px 32px; text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">📡</div>
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">
              Device Offline Alert
            </h1>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            <p style="color: #1f2937; font-size: 15px; margin-top: 0;">Hello,</p>

            <p style="color: #1f2937; font-size: 15px;">
              Your device is currently
              <span style="display: inline-block; background-color: #fee2e2; color: #b91c1c; font-weight: 700; padding: 2px 10px; border-radius: 6px; font-size: 13px;">
                🔴 OFFLINE
              </span>
            </p>

            <h3 style="color: #1d4ed8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 28px; margin-bottom: 12px; border-bottom: 2px solid #dbeafe; padding-bottom: 8px;">
              Device Details
            </h3>

            <table style="border-collapse: collapse; width: 100%;">
              <tbody>
                <tr style="background-color: #f0f6ff;">
                  <td style="padding: 12px 14px; font-weight: 600; color: #374151; font-size: 14px; border-radius: 6px 0 0 6px;">Device Name</td>
                  <td style="padding: 12px 14px; color: #111827; font-size: 14px; border-radius: 0 6px 6px 0;">${device.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 14px; font-weight: 600; color: #374151; font-size: 14px;">Device ID</td>
                  <td style="padding: 12px 14px; color: #111827; font-size: 14px;">${device.deviceId}</td>
                </tr>
                <tr style="background-color: #f0f6ff;">
                  <td style="padding: 12px 14px; font-weight: 600; color: #374151; font-size: 14px; border-radius: 6px 0 0 6px;">Status</td>
                  <td style="padding: 12px 14px; color: #b91c1c; font-weight: 700; font-size: 14px; border-radius: 0 6px 6px 0;">OFFLINE</td>
                </tr>
                <tr>
                  <td style="padding: 12px 14px; font-weight: 600; color: #374151; font-size: 14px;">Last Seen</td>
                  <td style="padding: 12px 14px; color: #111827; font-size: 14px;">${lastSeen}</td>
                </tr>
                <tr style="background-color: #f0f6ff;">
                  <td style="padding: 12px 14px; font-weight: 600; color: #374151; font-size: 14px; border-radius: 6px 0 0 6px;">Expected Interval</td>
                  <td style="padding: 12px 14px; color: #111827; font-size: 14px; border-radius: 0 6px 6px 0;">${device.expectedInterval} seconds</td>
                </tr>
              </tbody>
            </table>

            <p style="color: #1f2937; font-size: 15px; margin-top: 28px;">
              Please check the device connection at your earliest convenience.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f0f6ff; padding: 18px 32px; text-align: center; border-top: 1px solid #dbeafe;">
            <p style="color: #1d4ed8; font-weight: 600; font-size: 14px; margin: 0;">
              Clairco Device Monitor
            </p>
          </div>

        </div>
      </div>
    `,
  };
};