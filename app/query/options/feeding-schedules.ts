import { queryOptions } from "@tanstack/react-query";

import { $listFeedingSchedules } from "@/server/functions/feeding-schedules"; // Assuming this is the function to list feeding schedules

export const feedingScheduleKeys = {
  all: () => [{ scope: "feeding-schedules" }] as const,
  byHorseId: ({ horseId }: { horseId: string }) =>
    [{ ...feedingScheduleKeys.all()[0], horseId }] as const,
};

export const feedingSchedulesListOptions = ({
  horseId,
  page = 1,
  pageSize = 10,
}: { horseId: string; page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: feedingScheduleKeys.byHorseId({ horseId }),
    queryFn: async () => {
      const response = await $listFeedingSchedules({
        horseId,
        page,
        pageSize,
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
