import { queryOptions } from "@tanstack/react-query";

import {
  $getMaintenanceRequestById,
  $listMaintenanceRequests,
} from "@/server/functions/maintenance-requests";

// Define query keys for maintenance requests
export const maintenanceRequestKeys = {
  all: () => [{ scope: "maintenance-requests" }] as const,
  byId: ({ requestId }: { requestId: string }) =>
    [{ ...maintenanceRequestKeys.all()[0], requestId }] as const,
};

// Query option for fetching a single maintenance request by ID
export const maintenanceRequestOptions = ({
  requestId,
}: {
  requestId: string;
}) =>
  queryOptions({
    queryKey: maintenanceRequestKeys.byId({ requestId }),
    queryFn: async () => {
      const response = await $getMaintenanceRequestById({ requestId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Maintenance request not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of maintenance requests
export const maintenanceRequestsListOptions = ({
  page,
  pageSize,
  status,
  priority,
}: {
  page: number;
  pageSize: number;
  status?: "New" | "In Progress" | "Completed" | "Cancelled";
  priority?: "Low" | "Medium" | "High";
}) =>
  queryOptions({
    queryKey: maintenanceRequestKeys.all(),
    queryFn: async () => {
      const response = await $listMaintenanceRequests({
        page,
        pageSize,
        status,
        priority,
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
