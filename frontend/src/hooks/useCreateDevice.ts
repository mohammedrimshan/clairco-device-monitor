import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevice } from "../services/api/device.api.js";
import type { Device, CreateDeviceInput } from "../types/device.js";

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<Device, Error, CreateDeviceInput>({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
