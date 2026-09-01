import type { Device } from "@/types/device";
import { DeviceCard } from "./DeviceCard";

interface DeviceListProps {
  devices: Device[];
  onEdit: (device: Device) => void;
  onDelete: (device: Device) => void;
}

export function DeviceList({ devices, onEdit, onDelete }: DeviceListProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
