import { queryOptions } from "@tanstack/react-query";

import { $getShiftById, $listShifts } from "@/server/functions/shifts";

// Define query keys for shifts
export const shiftKeys = {
  all: () => [{ scope: "shifts" }] as const,
  byId: ({ shiftId }: { shiftId: string }) =>
    [{ ...shiftKeys.all()[0], shiftId }] as const,
};

// Query option for fetching a single shift by ID
export const shiftOptions = ({ shiftId }: { shiftId: string }) =>
  queryOptions({
    queryKey: shiftKeys.byId({ shiftId }),
    queryFn: async () => {
      const response = await $getShiftById({ shiftId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Shift not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of shifts
export const shiftsListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: shiftKeys.all(),
    queryFn: async () => {
      const response = await $listShifts({ page, pageSize });
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
