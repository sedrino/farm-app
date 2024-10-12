import { queryOptions } from "@tanstack/react-query";

import { $getBookingById, $listBookings } from "@/server/functions/bookings";

// Query Key Factories
export const bookingKeys = {
  all: () => [{ scope: "bookings" }] as const,
  byId: ({ bookingId }: { bookingId: string }) =>
    [{ ...bookingKeys.all()[0], bookingId }] as const,
  list: ({
    facilityId,
    dateRange,
  }: {
    facilityId?: string;
    dateRange?: string;
  }) => [{ ...bookingKeys.all()[0], facilityId, dateRange }] as const,
};

// Query Options
export const bookingDetailsOptions = ({ bookingId }: { bookingId: string }) =>
  queryOptions({
    queryKey: bookingKeys.byId({ bookingId }),
    queryFn: async () => {
      const response = await $getBookingById({ bookingId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Booking not found");
      }
      return response.data;
    },
  });

export const bookingsListOptions = ({
  facilityId,
  dateRange,
}: {
  facilityId?: string;
  dateRange?: string;
}) =>
  queryOptions({
    queryKey: bookingKeys.list({ facilityId, dateRange }),
    queryFn: async () => {
      const response = await $listBookings({ facilityId, dateRange });
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
