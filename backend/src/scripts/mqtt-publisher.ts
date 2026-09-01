import "dotenv/config";
import mqtt from "mqtt";
import { z } from "zod";

import { ENV } from "../config/env.js";

// --- Environment ---
const brokerUrl = ENV.MQTT_BROKER_URL ?? "mqtt://localhost:1883";
const apiBase = ENV.API_URL;
const heartbeatMs = ENV.MQTT_TEST_INTERVAL_MS;
const refreshMs = ENV.MQTT_DEVICE_REFRESH_INTERVAL_MS;

// --- Types & validation ---
// Only the fields the simulator needs — no coupling to the full Device model.
const simulatorDeviceSchema = z.object({
  deviceId: z.string().min(1),
  mqttTopic: z.string().min(1),
});

type SimulatorDevice = z.infer<typeof simulatorDeviceSchema>;

const devicesResponseSchema = z.array(z.unknown());

// --- State ---
let devices: SimulatorDevice[] = [];
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let refreshTimer: ReturnType<typeof setInterval> | null = null;
let intervalsStarted = false;

// --- Device discovery ---
const fetchDevices = async (): Promise<SimulatorDevice[]> => {
  const response = await fetch(`${apiBase}/devices`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const raw = devicesResponseSchema.parse(await response.json());

  const valid: SimulatorDevice[] = [];
  const seen = new Set<string>();

  for (const item of raw) {
    const result = simulatorDeviceSchema.safeParse(item);
    if (result.success && !seen.has(result.data.mqttTopic)) {
      seen.add(result.data.mqttTopic);
      valid.push(result.data);
    }
  }

  return valid;
};

const refreshDevices = async (): Promise<void> => {
  try {
    const discovered = await fetchDevices();
    const prevCount = devices.length;
    devices = discovered;

    if (discovered.length !== prevCount) {
      console.log(`[Simulator] Device list changed: ${discovered.length} device(s) discovered.`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[Simulator] Failed to fetch devices: ${message}`);
    console.warn("[Simulator] Will retry on next refresh.");
  }
};

// --- Heartbeat publishing ---
const publishHeartbeats = (client: mqtt.MqttClient): void => {
  if (devices.length === 0) {
    console.log("[Simulator] No devices to publish heartbeats for.");
    return;
  }

  for (const device of devices) {
    const payload = JSON.stringify({ deviceId: device.deviceId });

    client.publish(device.mqttTopic, payload, { qos: 0 }, (err) => {
      if (err) {
        console.error(`  ✗ ${device.deviceId}: ${err.message}`);
      } else {
        console.log(`  ✓ Heartbeat published for ${device.deviceId}`);
      }
    });
  }
};

// --- Startup ---
const startIntervals = (client: mqtt.MqttClient): void => {
  if (intervalsStarted) return;
  intervalsStarted = true;

  heartbeatTimer = setInterval(() => {
    console.log(`\n[${new Date().toISOString()}] Publishing heartbeats...`);
    publishHeartbeats(client);
  }, heartbeatMs);

  refreshTimer = setInterval(async () => {
    await refreshDevices();
  }, refreshMs);
};

// --- Graceful shutdown ---
const shutdown = (client: mqtt.MqttClient): void => {
  console.log("\nStopping MQTT test publisher...");

  if (heartbeatTimer !== null) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
  if (refreshTimer !== null) { clearInterval(refreshTimer); refreshTimer = null; }

  client.end(false, {}, () => {
    console.log("MQTT connection closed.");
    console.log("Publisher stopped.");
    process.exit(0);
  });
};

// --- Main ---
const main = async (): Promise<void> => {
  console.log("MQTT test publisher starting...");
  console.log(`Broker:          ${brokerUrl}`);
  console.log(`API:             ${apiBase}/devices`);
  console.log(`Heartbeat:       ${heartbeatMs / 1000}s`);
  console.log(`Device refresh:  ${refreshMs / 1000}s`);
  console.log("");

  const connectOptions: mqtt.IClientOptions = {};
  if (ENV.MQTT_USERNAME) connectOptions.username = ENV.MQTT_USERNAME;
  if (ENV.MQTT_PASSWORD) connectOptions.password = ENV.MQTT_PASSWORD;

  const client = mqtt.connect(brokerUrl, connectOptions);

  process.on("SIGINT", () => shutdown(client));
  process.on("SIGTERM", () => shutdown(client));

  client.on("connect", async () => {
    console.log("Connected to MQTT broker.\n");

    // Initial discovery + publish
    await refreshDevices();
    console.log(`Discovered ${devices.length} device(s).\n`);
    publishHeartbeats(client);

    startIntervals(client);
  });

  client.on("error", (err) => {
    console.error("[Simulator] MQTT error:", err.message);
  });

  client.on("offline", () => {
    console.warn("[Simulator] MQTT client offline.");
  });

  client.on("reconnect", () => {
    console.log("[Simulator] MQTT client reconnecting...");
  });
};

main().catch((err) => {
  console.error("[Simulator] Fatal error:", err);
  process.exit(1);
});
