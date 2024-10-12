import { queryOptions } from "@tanstack/react-query";

import { $getScheduleById } from "@/server/functions/schedules"; // Assuming this is the function to fetch a schedule by ID

export const scheduleKeys = {
  all: () => [{ scope: "schedules" }] as const,
  byId: ({ scheduleId }: { scheduleId: string }) =>
    [{ ...scheduleKeys.all()[0], scheduleId }] as const,
};

export const scheduleOptions = ({ scheduleId }: { scheduleId: string }) =>
  queryOptions({
    queryKey: scheduleKeys.byId({ scheduleId }),
    queryFn: async () => {
      const response = await $getScheduleById({ scheduleId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Schedule not found");
      }
      return response.data;
    },
  });
