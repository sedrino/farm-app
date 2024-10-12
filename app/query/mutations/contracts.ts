import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { contractKeys } from "@/query/options/contracts";
import {
  $createContract,
  $deleteContract,
  $generateContract,
  $updateContract,
} from "@/server/functions/contract";

export function useCreateContractMutation() {
  return useMutation({
    mutationFn: async (data: Parameters<typeof $createContract>[0]) => {
      const result = await $createContract(data);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.all(),
      });
    },
  });
}

export function useDeleteContractMutation(contractId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteContract({ contractId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.all(),
      });
    },
  });
}

export function useGenerateContractMutation(contractId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $generateContract>[0], "contractId">
    ) => {
      const result = await $generateContract({ contractId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.byId({ contractId }),
      });
    },
  });
}

export function useUpdateContractMutation(contractId: string) {
  return useMutation({
    mutationFn: async (
      data: Omit<Parameters<typeof $updateContract>[0], "contractId">
    ) => {
      const result = await $updateContract({ contractId, ...data });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.byId({ contractId }),
      });
    },
  });
}
