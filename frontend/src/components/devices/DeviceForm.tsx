import { useState } from "react";
import type { Device, CreateDeviceInput } from "@/types/device";
import { createDeviceSchema } from "@/schemas/device.schema";

interface DeviceFormProps {
  device?: Device;
  onSubmit: (data: CreateDeviceInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Generate the MQTT topic from the device ID to prevent topic/ID mismatches.
const deriveMqttTopic = (deviceId: string): string =>
  deviceId ? `devices/${deviceId}/data` : "";

export function DeviceForm({
  device,
  onSubmit,
  onCancel,
  isLoading,
}: DeviceFormProps) {
  const [formData, setFormData] = useState<CreateDeviceInput>({
    deviceId: device?.deviceId || "",
    name: device?.name || "",
    mqttTopic: device?.mqttTopic || "",
    expectedInterval: device?.expectedInterval || 30,
    alertEmail: device?.alertEmail || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateDeviceInput, string>>
  >({});

  const validateField = (name: keyof CreateDeviceInput, value: unknown) => {
    const newFormData = { ...formData, [name]: value };
    const result = createDeviceSchema.safeParse(newFormData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const fieldError = fieldErrors[name]?.[0];

      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const val =
      name === "expectedInterval" ? parseInt(value, 10) || 0 : value;

    if (name === "deviceId") {
      // Keep mqttTopic in sync with deviceId automatically.
      const derived = deriveMqttTopic(value);

      setFormData((prev) => ({
        ...prev,
        deviceId: value,
        mqttTopic: derived,
      }));

      if (errors.deviceId) {
        validateField("deviceId", value);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: val,
      }));

      if (errors[name as keyof CreateDeviceInput]) {
        validateField(name as keyof CreateDeviceInput, val);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    validateField(
      name as keyof CreateDeviceInput,
      formData[name as keyof CreateDeviceInput]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createDeviceSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        deviceId: fieldErrors.deviceId?.[0],
        name: fieldErrors.name?.[0],
        mqttTopic: fieldErrors.mqttTopic?.[0],
        expectedInterval: fieldErrors.expectedInterval?.[0],
        alertEmail: fieldErrors.alertEmail?.[0],
      });

      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Device ID
        </label>

        <input
          name="deviceId"
          value={formData.deviceId}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={!!device}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="e.g., AC-001"
        />

        {errors.deviceId && (
          <span className="text-red-500 text-xs">{errors.deviceId}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          placeholder="e.g., Living Room AC"
        />

        {errors.name && (
          <span className="text-red-500 text-xs">{errors.name}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          MQTT Topic
        </label>

        <input
          name="mqttTopic"
          value={formData.mqttTopic}
          readOnly
          disabled
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2 bg-gray-50 text-gray-500 cursor-not-allowed"
        />

        <p className="mt-1 text-xs text-gray-400">
          Automatically generated from Device ID.
        </p>

        {errors.mqttTopic && (
          <span className="text-red-500 text-xs">{errors.mqttTopic}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Expected Interval (seconds)
        </label>

        <input
          name="expectedInterval"
          type="number"
          min="1"
          value={formData.expectedInterval}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />

        {errors.expectedInterval && (
          <span className="text-red-500 text-xs">
            {errors.expectedInterval}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Alert Email
        </label>

        <input
          name="alertEmail"
          type="email"
          value={formData.alertEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          placeholder="e.g., alert@example.com"
        />

        {errors.alertEmail && (
          <span className="text-red-500 text-xs">{errors.alertEmail}</span>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Device"}
        </button>
      </div>
    </form>
  );
}