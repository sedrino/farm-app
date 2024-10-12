import { queryOptions } from "@tanstack/react-query";

import { $listHealthRecords } from "@/server/functions/health-records"; // Assuming this is the function to list health records

export const healthRecordKeys = {
  all: () => [{ scope: "health-records" }] as const,
  list: ({ horseId }: { horseId: string }) =>
    [{ ...healthRecordKeys.all()[0], horseId }] as const,
};

export const healthRecordsListOptions = ({ horseId }: { horseId: string }) =>
  queryOptions({
    queryKey: healthRecordKeys.list({ horseId }),
    queryFn: async () => {
      const response = await $listHealthRecords({ horseId });
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
