import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDevice } from "@/services/api/device.api";
import type { Device, UpdateDeviceInput } from "@/types/device";

interface UpdateDeviceVariables {
  id: number;
  data: UpdateDeviceInput;
}

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<Device, Error, UpdateDeviceVariables>({
    mutationFn: ({ id, data }) => updateDevice(id, data),
    onSuccess: (updatedDevice) => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      queryClient.invalidateQueries({ queryKey: ["devices", updatedDevice.id] });
    },
  });
};
