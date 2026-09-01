export const MESSAGES = {
  DEVICE: {
    NOT_FOUND: "Device not found",
    ALREADY_EXISTS: "Device ID already exists. Please use a different Device ID.",
    MQTT_TOPIC_EXISTS: "MQTT topic is already assigned to another device.",
    CREATED: "Device created successfully",
    UPDATED: "Device updated successfully",
    DELETED: "Device deleted successfully",
    INVALID_ID: "Invalid device ID",
    INVALID_INPUT: "Invalid input",
  },
  ERROR: {
    INTERNAL_SERVER_ERROR: "Internal server error",
    ROUTE_NOT_FOUND: "Route not found",
  }
} as const;
