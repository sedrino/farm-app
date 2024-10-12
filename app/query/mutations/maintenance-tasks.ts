import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { maintenanceTaskKeys } from "@/query/options/maintenance-tasks";
import {
  $completeMaintenanceTask,
  $createMaintenanceTask,
  $deleteMaintenanceTask,
  $updateMaintenanceTask,
} from "@/server/functions/maintenance-task";

export function useCompleteMaintenanceTaskMutation(taskId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $completeMaintenanceTask>[0], "taskId">
    ) => {
      const result = await $completeMaintenanceTask({ taskId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceTaskKeys.byId({ taskId }),
      });
    },
  });
}

export function useCreateMaintenanceTaskMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createMaintenanceTask>[0]) => {
      const result = await $createMaintenanceTask(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceTaskKeys.all(),
      });
    },
  });
}

export function useDeleteMaintenanceTaskMutation(taskId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteMaintenanceTask({ taskId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceTaskKeys.all(),
      });
    },
  });
}

export function useUpdateMaintenanceTaskMutation(taskId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateMaintenanceTask>[0], "taskId">
    ) => {
      const result = await $updateMaintenanceTask({ taskId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: maintenanceTaskKeys.byId({ taskId }),
      });
    },
  });
}
