export function EmptyState() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50">
      <div className="text-lg font-medium text-gray-600">
        No devices found
      </div>
      <p className="text-sm text-gray-500">
        Get started by creating a new device.
      </p>
    </div>
  );
}
