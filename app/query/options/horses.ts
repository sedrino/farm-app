import { queryOptions } from "@tanstack/react-query";

import { $getHorseById, $listHorses } from "@/server/functions/horses";

// Define query keys for horses
export const horseKeys = {
  all: () => [{ scope: "horses" }] as const,
  byId: ({ horseId }: { horseId: string }) =>
    [{ ...horseKeys.all()[0], horseId }] as const,
};

// Query option for fetching horse details by ID
export const horseDetailsOptions = ({ horseId }: { horseId: string }) =>
  queryOptions({
    queryKey: horseKeys.byId({ horseId }),
    queryFn: async () => {
      const response = await $getHorseById({ horseId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Horse not found");
      }
      return response.data;
    },
  });

// Query option for fetching horse options (used in select inputs)
export const horseOptions = ({ horseId }: { horseId: string }) =>
  queryOptions({
    queryKey: horseKeys.byId({ horseId }),
    queryFn: async () => {
      const response = await $getHorseById({ horseId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Horse not found");
      }
      return response.data;
    },
  });

// Query option for fetching the list of horses
export const horsesListOptions = ({
  page,
  pageSize,
  search,
  breed,
  ageRange,
  specialNeeds,
}: {
  page: number;
  pageSize: number;
  search?: string;
  breed?: string;
  ageRange?: string;
  specialNeeds?: string;
}) =>
  queryOptions({
    queryKey: horseKeys.all(),
    queryFn: async () => {
      const response = await $listHorses({
        page,
        pageSize,
        search,
        breed,
        ageRange,
        specialNeeds,
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
