import { queryOptions } from "@tanstack/react-query";

import { $listBoardingContracts } from "@/server/functions/boarding-contracts"; // Assuming this is the function to list boarding contracts

export const boardingContractKeys = {
  all: () => [{ scope: "boarding-contracts" }] as const,
  list: ({
    page,
    pageSize,
    search,
    sort,
  }: {
    page: number;
    pageSize: number;
    search?: string;
    sort?: "startDate" | "endDate" | "status";
  }) =>
    [
      { ...boardingContractKeys.all()[0], page, pageSize, search, sort },
    ] as const,
};

export const boardingContractsListOptions = ({
  page,
  pageSize,
  search,
  sort,
}: {
  page: number;
  pageSize: number;
  search?: string;
  sort?: "startDate" | "endDate" | "status";
}) =>
  queryOptions({
    queryKey: boardingContractKeys.list({ page, pageSize, search, sort }),
    queryFn: async () => {
      const response = await $listBoardingContracts({
        page,
        pageSize,
        search,
        sort,
      });
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
