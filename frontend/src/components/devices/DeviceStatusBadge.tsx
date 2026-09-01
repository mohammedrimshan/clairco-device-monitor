import type { Device } from "@/types/device";

interface DeviceStatusBadgeProps {
  status: Device["status"];
}

export function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  const isOnline = status === "ONLINE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOnline ? "bg-green-600" : "bg-red-600"
        }`}
        aria-hidden="true"
      ></span>
      {status}
    </span>
  );
}
