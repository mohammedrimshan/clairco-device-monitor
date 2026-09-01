import type { Device } from "@/types/device";
import { DeviceStatusBadge } from "@/components/devices/DeviceStatusBadge";

interface DeviceHealthListProps {
  devices: Device[];
}

export function DeviceHealthList({ devices }: DeviceHealthListProps) {
  // Show offline devices first, then sort by most recent heartbeat.
  const sortedDevices = [...devices].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "OFFLINE" ? -1 : 1;
    }

    const aTime = a.lastSeenAt
      ? new Date(a.lastSeenAt).getTime()
      : 0;

    const bTime = b.lastSeenAt
      ? new Date(b.lastSeenAt).getTime()
      : 0;

    return bTime - aTime;
  });

  const recentDevices = sortedDevices.slice(0, 5);

  const formatLastSeen = (
    dateString: string | null | undefined
  ): string => {
    if (!dateString) {
      return "Never";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 60) {
      return `${diffSecs}s ago`;
    }

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-500">
          No devices connected yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentDevices.map((device) => (
        <div
          key={device.id}
          className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 transition-colors hover:bg-gray-100"
        >
          <div className="flex min-w-0 flex-col pr-4">
            <span className="truncate text-sm font-semibold text-gray-900">
              {device.name}
            </span>

            <span className="truncate text-xs text-gray-500">
              {device.deviceId} • Interval: {device.expectedInterval}s
            </span>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <DeviceStatusBadge status={device.status} />

            <span className="text-[10px] font-medium uppercase text-gray-400">
              {formatLastSeen(device.lastSeenAt)}
            </span>
          </div>
        </div>
      ))}

      {devices.length > 5 && (
        <div className="pt-2 text-center">
          <span className="text-xs text-gray-400">
            Showing {recentDevices.length} of {devices.length} devices
          </span>
        </div>
      )}
    </div>
  );
}