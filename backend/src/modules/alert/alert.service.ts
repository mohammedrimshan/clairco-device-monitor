import nodemailer from "nodemailer";

export interface AlertDevice {
  deviceId: string;
  name: string;
  alertEmail: string;
  lastSeenAt: Date | null;
  expectedInterval: number;
}

export const sendOfflineAlert = async (
  device: AlertDevice
): Promise<boolean> => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
    process.env;

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !SMTP_FROM
  ) {
    console.warn("SMTP configuration is missing. Cannot send offline alert.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    const lastSeenStr = device.lastSeenAt
      ? device.lastSeenAt.toISOString()
      : "Never";

    const mailOptions = {
      from: SMTP_FROM,
      to: device.alertEmail,
      subject: `ALERT: Device ${device.name} is OFFLINE`,
      text: `Hello,\n\nYour device is currently OFFLINE.\n\nDetails:\n- Device Name: ${device.name}\n- Device ID: ${device.deviceId}\n- Status: OFFLINE\n- Last Seen: ${lastSeenStr}\n- Expected Interval: ${device.expectedInterval} seconds\n\nPlease check the device connection.\n\nClairco Device Monitor`,
      html: `<p>Hello,</p>
             <p>Your device is currently <strong>OFFLINE</strong>.</p>
             <h3>Details:</h3>
             <ul>
               <li><strong>Device Name:</strong> ${device.name}</li>
               <li><strong>Device ID:</strong> ${device.deviceId}</li>
               <li><strong>Status:</strong> OFFLINE</li>
               <li><strong>Last Seen:</strong> ${lastSeenStr}</li>
               <li><strong>Expected Interval:</strong> ${device.expectedInterval} seconds</li>
             </ul>
             <p>Please check the device connection.</p>
             <p>Clairco Device Monitor</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Alert sent to ${device.alertEmail}:`, {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    return true;
  } catch (error) {
    console.error(
      `Failed to send offline alert for device ${device.deviceId}:`,
      error
    );
    return false;
  }
};
