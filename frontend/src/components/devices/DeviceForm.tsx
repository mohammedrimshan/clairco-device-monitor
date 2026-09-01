import { useState } from "react";
import type { Device, CreateDeviceInput } from "@/types/device";
import { createDeviceSchema } from "@/schemas/device.schema";

interface DeviceFormProps {
  device?: Device;
  onSubmit: (data: CreateDeviceInput) => void;
  onCancel: () => void;
  isLoading: boolean;
}

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expectedInterval" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createDeviceSchema.safeParse(formData);

    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        deviceId: formatted.deviceId?._errors[0],
        name: formatted.name?._errors[0],
        mqttTopic: formatted.mqttTopic?._errors[0],
        expectedInterval: formatted.expectedInterval?._errors[0],
        alertEmail: formatted.alertEmail?._errors[0],
      });
      return;
    }

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
          disabled={!!device}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="e.g., AC-001"
        />
        {errors.deviceId && (
          <span className="text-red-500 text-xs">{errors.deviceId}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
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
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          placeholder="e.g., devices/AC-001/data"
        />
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />
        {errors.expectedInterval && (
          <span className="text-red-500 text-xs">{errors.expectedInterval}</span>
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
