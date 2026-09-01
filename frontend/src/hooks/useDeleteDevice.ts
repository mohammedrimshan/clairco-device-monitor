import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDevice } from "@/services/api/device.api";
import type { DeleteDeviceResponse } from "@/types/device";

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteDeviceResponse, Error, number>({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
