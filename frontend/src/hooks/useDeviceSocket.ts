import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/services/socket";
import { deviceSchema } from "@/schemas/device.schema";
import type { DeviceListResponse, Device } from "@/types/device";

export const useDeviceSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleDeviceUpdated = (payload: unknown) => {
      const result = deviceSchema.safeParse(payload);

      if (!result.success) {
        console.warn(
          "Socket received invalid device:updated payload:",
          result.error
        );
        return;
      }

      const updatedDevice = result.data;

      // Update the individual device query cache if it exists
      queryClient.setQueryData<Device>(
        ["devices", updatedDevice.id],
        (oldData) => {
          return oldData ? updatedDevice : oldData;
        }
      );

      // Update the main devices list query cache
      queryClient.setQueryData<DeviceListResponse>(["devices"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return oldData.map((device) =>
          device.id === updatedDevice.id ? updatedDevice : device
        );
      });
    };

    socket.on("device:updated", handleDeviceUpdated);

    // Cleanup listener on unmount
    return () => {
      socket.off("device:updated", handleDeviceUpdated);
    };
  }, [queryClient]);
};
