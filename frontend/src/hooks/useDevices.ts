import { useQuery } from "@tanstack/react-query";
import { getDevices } from "../services/api/device.api.js";
import type { DeviceListResponse } from "../types/device.js";

export const useDevices = () => {
  return useQuery<DeviceListResponse, Error>({
    queryKey: ["devices"],
    queryFn: getDevices,
  });
};
