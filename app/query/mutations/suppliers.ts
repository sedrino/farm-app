import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { supplierKeys } from "@/query/options/suppliers";
import { $deleteSupplier } from "@/server/functions/supplier";

export function useDeleteSupplierMutation(supplierId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteSupplier({ supplierId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: supplierKeys.all(),
      });
    },
  });
}
