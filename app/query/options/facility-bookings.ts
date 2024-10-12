import { queryOptions } from "@tanstack/react-query";

import {
  $getFacilityBookingById,
  $listFacilityBookings,
} from "@/server/functions/facility-bookings";

// Define query keys for facility bookings
export const facilityBookingKeys = {
  all: () => [{ scope: "facility-bookings" }] as const,
  byId: ({ bookingId }: { bookingId: string }) =>
    [{ ...facilityBookingKeys.all()[0], bookingId }] as const,
};

// Query option for fetching a single facility booking by ID
export const facilityBookingOptions = ({ bookingId }: { bookingId: string }) =>
  queryOptions({
    queryKey: facilityBookingKeys.byId({ bookingId }),
    queryFn: async () => {
      const response = await $getFacilityBookingById({ bookingId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Facility booking not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of facility bookings
export const facilityBookingsListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: facilityBookingKeys.all(),
    queryFn: async () => {
      const response = await $listFacilityBookings({ page, pageSize });
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
