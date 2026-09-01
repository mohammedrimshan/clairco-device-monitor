import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevice } from "@/services/api/device.api";
import type { Device, CreateDeviceInput, ApiResponse } from "@/types/device";

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Device>, Error, CreateDeviceInput>({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
