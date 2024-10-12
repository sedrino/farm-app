import { queryOptions } from "@tanstack/react-query";

import {
  $getMaintenanceTaskById,
  $listMaintenanceTasks,
  $listScheduledMaintenanceTasks,
} from "@/server/functions/maintenance-tasks";

// Define query keys for maintenance tasks
export const maintenanceTaskKeys = {
  all: () => [{ scope: "maintenance-tasks" }] as const,
  byId: ({ taskId }: { taskId: string }) =>
    [{ ...maintenanceTaskKeys.all()[0], taskId }] as const,
};

// Query option for fetching a single maintenance task by ID
export const maintenanceTaskOptions = ({ taskId }: { taskId: string }) =>
  queryOptions({
    queryKey: maintenanceTaskKeys.byId({ taskId }),
    queryFn: async () => {
      const response = await $getMaintenanceTaskById({ taskId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Maintenance task not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of maintenance tasks
export const maintenanceTasksListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: maintenanceTaskKeys.all(),
    queryFn: async () => {
      const response = await $listMaintenanceTasks({ page, pageSize });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        return [];
      }
      return response.data;
    },
  });

// Query option for fetching the list of scheduled maintenance tasks
export const scheduledMaintenanceTasksListOptions = ({
  page,
  pageSize,
  filter,
}: {
  page: number;
  pageSize: number;
  filter: "overdue" | "today" | "future";
}) =>
  queryOptions({
    queryKey: maintenanceTaskKeys.all(),
    queryFn: async () => {
      const response = await $listScheduledMaintenanceTasks({
        page,
        pageSize,
        filter,
      });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        return [];
      }
      return response.data;
    },
  });
