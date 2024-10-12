import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { bookingKeys } from "@/query/options/bookings";
import { $createBooking, $updateBooking } from "@/server/functions/booking";

export function useCreateBookingMutation(facilityId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $createBooking>[0], "facilityId">
    ) => {
      const result = await $createBooking({ facilityId, ...data });
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

export function useUpdateBookingMutation(bookingId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateBooking>[0], "bookingId">
    ) => {
      const result = await $updateBooking({ bookingId, ...data });
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
