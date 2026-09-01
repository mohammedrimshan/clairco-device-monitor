import type { Device } from "@/types/device";
import { DeviceStatusBadge } from "./DeviceStatusBadge";

interface DeviceCardProps {
  device: Device;
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
}

export function DeviceCard({ device, onEdit, onDelete }: DeviceCardProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm bg-white">
      <div className="flex flex-row items-center justify-between p-6 pb-2 border-b border-gray-100">
        <h3 className="font-semibold leading-none tracking-tight text-gray-900 truncate pr-2">
          {device.name}
        </h3>
        <DeviceStatusBadge status={device.status} />
      </div>
      <div className="p-6 pt-4 text-sm text-gray-600">
        <div className="grid gap-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">ID:</span>
            <span className="font-medium text-gray-900">{device.deviceId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Topic:</span>
            <span
              className="font-medium text-gray-900 truncate max-w-[150px]"
              title={device.mqttTopic}
            >
              {device.mqttTopic}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Interval:</span>
            <span className="font-medium text-gray-900">
              {device.expectedInterval}s
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Last Seen:</span>
            <span className="font-medium text-gray-900">
              {device.lastSeenAt
                ? new Date(device.lastSeenAt).toLocaleString()
                : "Never"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Alert Email:</span>
            <span
              className="font-medium text-gray-900 truncate max-w-[150px]"
              title={device.alertEmail}
            >
              {device.alertEmail}
            </span>
          </div>
        </div>
      </div>
      <div className="flex border-t border-gray-100">
        <button
          onClick={() => onEdit(device)}
          className="flex-1 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-bl-xl transition-colors"
        >
          Edit
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => onDelete(device)}
          className="flex-1 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-br-xl transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
