import { queryOptions } from "@tanstack/react-query";

import {
  $getFacilityById,
  $listFacilities,
} from "@/server/functions/facilities";

// Define query keys for facilities
export const facilityKeys = {
  all: () => [{ scope: "facilities" }] as const,
  list: () => [{ ...facilityKeys.all()[0], action: "list" }] as const,
  byId: ({ facilityId }: { facilityId: string }) =>
    [{ ...facilityKeys.all()[0], facilityId }] as const,
};

// Query option for listing facilities
export const facilitiesListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: facilityKeys.list(),
    queryFn: async () => {
      const response = await $listFacilities({ page, pageSize });
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

// Query option for a single facility
export const facilityOptions = ({ facilityId }: { facilityId: string }) =>
  queryOptions({
    queryKey: facilityKeys.byId({ facilityId }),
    queryFn: async () => {
      const response = await $getFacilityById({ facilityId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Facility not found");
      }
      return response.data;
    },
  });
