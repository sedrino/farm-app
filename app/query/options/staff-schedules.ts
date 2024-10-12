import { queryOptions } from "@tanstack/react-query";

import {
  $getStaffSchedule,
  $listStaffSchedules,
} from "@/server/functions/staff-schedules";

// Define query keys for staff schedules
export const staffScheduleKeys = {
  all: () => [{ scope: "staff-schedules" }] as const,
  byStaffId: ({ staffId }: { staffId: string }) =>
    [{ ...staffScheduleKeys.all()[0], staffId }] as const,
};

// Query option for fetching a specific staff member's schedule
export const staffScheduleOptions = ({ staffId }: { staffId: string }) =>
  queryOptions({
    queryKey: staffScheduleKeys.byStaffId({ staffId }),
    queryFn: async () => {
      const response = await $getStaffSchedule({ staffId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Staff schedule not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of staff schedules
export const staffSchedulesListOptions = ({
  page,
  pageSize,
  week,
  role,
}: {
  page: number;
  pageSize: number;
  week?: string;
  role?: string;
}) =>
  queryOptions({
    queryKey: staffScheduleKeys.all(),
    queryFn: async () => {
      const response = await $listStaffSchedules({
        page,
        pageSize,
        week,
        role,
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
