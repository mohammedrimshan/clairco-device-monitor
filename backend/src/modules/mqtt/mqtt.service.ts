import mqtt from "mqtt";
import { mqttPayloadSchema } from "./mqtt.schema.js";
import * as deviceRepository from "../device/device.repository.js";
import { emitDeviceUpdated } from "../socket/socket.service.js";


let client: mqtt.MqttClient | null = null;

export const startMqttService = async () => {
  const brokerUrl = process.env.MQTT_BROKER_URL;
  if (!brokerUrl) {
    console.error("MQTT_BROKER_URL is not defined in environment variables");
    return;
  }

  const options: mqtt.IClientOptions = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  };

  try {
    client = mqtt.connect(brokerUrl, options);

    client.on("connect", async () => {
      console.log("Connected to MQTT broker");

      try {
        const devices = await deviceRepository.findAllDevices();
        devices.forEach((device) => {
          if (device.mqttTopic) {
            client?.subscribe(device.mqttTopic, (err) => {
              if (err) {
                console.error(`Failed to subscribe to ${device.mqttTopic}:`, err);
              } else {
                console.log(`Subscribed to topic: ${device.mqttTopic}`);
              }
            });
          }
        });
      } catch (err) {
        console.error("Failed to fetch devices for subscription:", err);
      }
    });

    client.on("message", async (topic, message) => {
      let parsedJson: unknown;
      
      try {
        parsedJson = JSON.parse(message.toString());
      } catch (err) {
        console.warn(`Malformed JSON message on topic ${topic}`);
        return;
      }

      const validationResult = mqttPayloadSchema.safeParse(parsedJson);
      
      if (!validationResult.success) {
        console.warn(`Invalid message format on topic ${topic}: missing or invalid deviceId`);
        return;
      }

      const deviceId = validationResult.data.deviceId;

      try {
        const device = await deviceRepository.findDeviceByDeviceId(deviceId);

        if (!device) {
          console.warn(`Received message for unknown deviceId: ${deviceId}`);
          return;
        }

        const updatedDevice = await deviceRepository.updateDeviceStatus(deviceId, {
          status: "ONLINE",
          lastSeenAt: new Date(),
          alertSent: false,
        });

        emitDeviceUpdated(updatedDevice);

      } catch (err) {
        console.error(`Error processing message for deviceId ${deviceId}:`, err);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT Client Error:", err);
    });

    client.on("offline", () => {
      console.warn("MQTT Client Offline");
    });

    client.on("reconnect", () => {
      console.log("MQTT Client Reconnecting...");
    });

  } catch (err) {
    console.error("Failed to start MQTT service:", err);
  }
};
