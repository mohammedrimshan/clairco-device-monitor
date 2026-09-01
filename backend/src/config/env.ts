import "dotenv/config";

export const ENV = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL!,
  MQTT_BROKER_URL: process.env.MQTT_BROKER_URL,
  MQTT_USERNAME: process.env.MQTT_USERNAME,
  MQTT_PASSWORD: process.env.MQTT_PASSWORD,
  MONITORING_INTERVAL_MS: process.env.MONITORING_INTERVAL_MS
    ? parseInt(process.env.MONITORING_INTERVAL_MS, 10)
    : 5000,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  API_URL: process.env.API_URL ?? "http://localhost:5000/api",
  MQTT_TEST_INTERVAL_MS: Number(process.env.MQTT_TEST_INTERVAL_MS ?? 10000),
  MQTT_DEVICE_REFRESH_INTERVAL_MS: Number(
    process.env.MQTT_DEVICE_REFRESH_INTERVAL_MS ?? 10000
  ),
} as const;
