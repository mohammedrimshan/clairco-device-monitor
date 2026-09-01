import nodemailer from "nodemailer";

import { ENV } from "../../config/env.js";
import { createOfflineAlertTemplate } from "./templates/offline-alert.template.js";
import type { AlertDevice } from "./alert.types.js";

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = ENV;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
};

const transporter = createTransporter();

if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error("[SMTP] Connection failed:", error.message);
    } else {
      console.log("[SMTP] Server is ready to accept messages");
    }
  });
}

export const sendOfflineAlert = async (
  device: AlertDevice
): Promise<boolean> => {
  const { SMTP_FROM } = ENV;

  if (!transporter || !SMTP_FROM) {
    console.warn(
      "SMTP configuration is missing. Cannot send offline alert."
    );
    return false;
  }

  try {
    const email = createOfflineAlertTemplate(device);

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: device.alertEmail,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    console.log(`Alert sent to ${device.alertEmail}:`, {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });

    return true;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email error";

    console.error(
      `Failed to send offline alert for device ${device.deviceId}: ${message}`
    );

    return false;
  }
};