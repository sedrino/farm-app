import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { stallCustomizationKeys } from "@/query/options/stall-customizations";
import {
  $addStallCustomization,
  $deleteStallCustomization,
  $getStallCustomizations,
} from "@/server/functions/stall-customization";

export function useAddStallCustomizationMutation(stallId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $addStallCustomization>[0], "stallId">
    ) => {
      const result = await $addStallCustomization({ stallId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stallCustomizationKeys.list({ stallId }),
      });
    },
  });
}

export function useDeleteStallCustomizationMutation(stallId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $deleteStallCustomization>[0], "stallId">
    ) => {
      const result = await $deleteStallCustomization({ stallId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stallCustomizationKeys.list({ stallId }),
      });
    },
  });
}

export function useStallCustomizationsQuery(stallId: string) {
  return useQuery({
    queryKey: stallCustomizationKeys.list({ stallId }),
    queryFn: async () => {
      const result = await $getStallCustomizations({ stallId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
  });
}
