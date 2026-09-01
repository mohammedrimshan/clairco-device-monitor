import mqtt from "mqtt";
import { mqttPayloadSchema } from "./mqtt.schema.js";
import * as deviceRepository from "../device/device.repository.js";
import { emitDeviceUpdated } from "../socket/socket.service.js";

let client: mqtt.MqttClient | null = null;

// Track subscribed topics to avoid duplicate subscriptions.
const subscribedTopics = new Set<string>();

// --- Dynamic subscription helpers ---

export const subscribeToTopic = (topic: string): void => {
  if (!client) {
    console.warn(`[MQTT] Cannot subscribe to ${topic}: client not initialized.`);
    return;
  }

  if (!client.connected) {
    console.warn(`[MQTT] Cannot subscribe to ${topic}: client not connected.`);
    return;
  }

  if (subscribedTopics.has(topic)) {
    return; // already subscribed, no-op
  }

  client.subscribe(topic, (err) => {
    if (err) {
      console.error(`[MQTT] Failed to subscribe to ${topic}:`, err.message);
    } else {
      subscribedTopics.add(topic);
      console.log(`[MQTT] Subscribed to topic: ${topic}`);
    }
  });
};

export const unsubscribeFromTopic = (topic: string): void => {
  if (!client || !client.connected) {
    subscribedTopics.delete(topic);
    return;
  }

  if (!subscribedTopics.has(topic)) {
    return; // not subscribed, no-op
  }

  client.unsubscribe(topic, (err) => {
    if (err) {
      console.error(`[MQTT] Failed to unsubscribe from ${topic}:`, err.message);
    } else {
      subscribedTopics.delete(topic);
      console.log(`[MQTT] Unsubscribed from topic: ${topic}`);
    }
  });
};

// --- Service startup ---

export const startMqttService = async (): Promise<void> => {
  const brokerUrl = process.env.MQTT_BROKER_URL;
  if (!brokerUrl) {
    console.error("[MQTT] MQTT_BROKER_URL is not defined in environment variables");
    return;
  }

  const options: mqtt.IClientOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  };

  try {
    client = mqtt.connect(brokerUrl, options);

    client.on("connect", async () => {
      console.log("[MQTT] Connected to broker");

      try {
        const devices = await deviceRepository.findAllDevices();
        for (const device of devices) {
          if (device.mqttTopic) {
            // Use subscribeToTopic so the Set stays in sync.
            subscribeToTopic(device.mqttTopic);
          }
        }
      } catch (err) {
        console.error("[MQTT] Failed to fetch devices for startup subscription:", err);
      }
    });

    client.on("message", async (topic, message) => {
      let parsedJson: unknown;

      try {
        parsedJson = JSON.parse(message.toString());
      } catch {
        console.warn(`[MQTT] Malformed JSON on topic ${topic}`);
        return;
      }

      const result = mqttPayloadSchema.safeParse(parsedJson);
      if (!result.success) {
        console.warn(`[MQTT] Invalid payload on topic ${topic}: missing or invalid deviceId`);
        return;
      }

      const { deviceId } = result.data;

      try {
        const device = await deviceRepository.findDeviceByDeviceId(deviceId);

        if (!device) {
          console.warn(`[MQTT] Received message for unknown deviceId: ${deviceId}`);
          return;
        }

        const updatedDevice = await deviceRepository.updateDeviceStatus(deviceId, {
          status: "ONLINE",
          lastSeenAt: new Date(),
          alertSent: false,
        });

        emitDeviceUpdated(updatedDevice);
      } catch (err) {
        console.error(`[MQTT] Error processing message for deviceId ${deviceId}:`, err);
      }
    });

    client.on("error", (err) => {
      console.error("[MQTT] Client error:", err.message);
    });

    client.on("offline", () => {
      console.warn("[MQTT] Client offline");
    });

    client.on("reconnect", () => {
      console.log("[MQTT] Client reconnecting...");
    });
  } catch (err) {
    console.error("[MQTT] Failed to start service:", err);
  }
};
