import { queryOptions } from "@tanstack/react-query";

import { $getContractById, $listContracts } from "@/server/functions/contracts";

// Define query keys for contracts
export const contractKeys = {
  all: () => [{ scope: "contracts" }] as const,
  byId: ({ contractId }: { contractId: string }) =>
    [{ ...contractKeys.all()[0], contractId }] as const,
  forBoarder: ({ boarderId }: { boarderId: string }) =>
    [{ ...contractKeys.all()[0], boarderId }] as const,
};

// Query option for fetching contract details by ID
export const contractDetailsOptions = ({
  contractId,
}: {
  contractId: string;
}) =>
  queryOptions({
    queryKey: contractKeys.byId({ contractId }),
    queryFn: async () => {
      const response = await $getContractById({ contractId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Contract not found");
      }
      return response.data;
    },
  });

// Query option for fetching contracts for a specific boarder
export const contractOptions = ({ boarderId }: { boarderId: string }) =>
  queryOptions({
    queryKey: contractKeys.forBoarder({ boarderId }),
    queryFn: async () => {
      const response = await $listContracts({ boarderId });
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

// Query option for fetching the list of contracts
export const contractsListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: contractKeys.all(),
    queryFn: async () => {
      const response = await $listContracts({ page, pageSize });
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
