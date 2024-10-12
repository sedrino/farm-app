import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { facilityKeys } from "@/query/options/facilities";
import { $createFacility, $deleteFacility } from "@/server/functions/facility";

export function useCreateFacilityMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createFacility>[0]) => {
      const result = await $createFacility(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: facilityKeys.all(),
      });
    },
  });
}

export function useDeleteFacilityMutation(facilityId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteFacility({ facilityId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: facilityKeys.all(),
      });
    },
  });
}
