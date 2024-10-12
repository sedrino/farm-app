import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/query/client";
import { contractTemplateKeys } from "@/query/options/contract-templates";
import { $deleteContractTemplate } from "@/server/functions/contract-template";

export function useDeleteContractTemplateMutation(templateId: string) {
  return useMutation({
    mutationFn: async () => {
      const result = await $deleteContractTemplate({ templateId });
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contractTemplateKeys.all(),
      });
    },
  });
}
