import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { bookingKeys } from "@/query/options/facility-bookings";
import {
  $cancelBooking,
  $createFacilityBooking,
  $updateFacilityBooking,
} from "@/server/functions/facility-booking";

export function useCancelBookingMutation(bookingId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $cancelBooking({ bookingId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.all(),
      });
    },
  });
}

export function useCreateFacilityBookingMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createFacilityBooking>[0]) => {
      const result = await $createFacilityBooking(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.all(),
      });
    },
  });
}

export function useUpdateFacilityBookingMutation(bookingId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateFacilityBooking>[0], "bookingId">
    ) => {
      const result = await $updateFacilityBooking({ bookingId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookingKeys.byId({ bookingId }),
      });
    },
  });
}
