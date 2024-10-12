import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { maintenanceRequestKeys } from "@/query/options/maintenance-requests";
import {
  $createMaintenanceRequest,
  $deleteMaintenanceRequest,
  $updateMaintenanceRequest,
} from "@/server/functions/maintenance-request";

export function useCreateMaintenanceRequestMutation() {
  return useMutation({
    mutationFn: async (
      data: Parameters<typeof $createMaintenanceRequest>[0]
    ) => {
      const result = await $createMaintenanceRequest(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceRequestKeys.all(),
      });
    },
  });
}

export function useDeleteMaintenanceRequestMutation(requestId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteMaintenanceRequest({ requestId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceRequestKeys.all(),
      });
    },
  });
}

export function useUpdateMaintenanceRequestMutation(requestId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateMaintenanceRequest>[0], "requestId">
    ) => {
      const result = await $updateMaintenanceRequest({ requestId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceRequestKeys.byId({ requestId }),
      });
    },
  });
}
