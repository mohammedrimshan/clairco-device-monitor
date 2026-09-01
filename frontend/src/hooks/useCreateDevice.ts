import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevice } from "@/services/api/device.api";
import type { Device, CreateDeviceInput } from "@/types/device";

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<Device, Error, CreateDeviceInput>({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
