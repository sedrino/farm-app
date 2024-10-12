import { queryOptions } from "@tanstack/react-query";

import {
  $getStaffById,
  $listStaff,
  $listStaffRoles,
} from "@/server/functions/staff";

// Query Key Factories
export const staffKeys = {
  all: () => [{ scope: "staff" }] as const,
  byId: ({ staffId }: { staffId: string }) =>
    [{ ...staffKeys.all()[0], staffId }] as const,
};

// Query Options
export const staffDetailsOptions = ({ staffId }: { staffId: string }) =>
  queryOptions({
    queryKey: staffKeys.byId({ staffId }),
    queryFn: async () => {
      const response = await $getStaffById({ staffId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Staff member not found");
      }
      return response.data;
    },
  });

export const staffListOptions = ({
  page,
  pageSize,
  search,
  sort,
}: {
  page: number;
  pageSize: number;
  search?: string;
  sort?: "name" | "role" | "status";
}) =>
  queryOptions({
    queryKey: staffKeys.all(),
    queryFn: async () => {
      const response = await $listStaff({
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

export const staffOptions = ({
  staffId,
}: {
  staffId: string;
}): ReturnType<typeof queryOptions> =>
  queryOptions({
    queryKey: staffKeys.byId({ staffId }),
    queryFn: async () => {
      const response = await $getStaffById({ staffId });
      if ("inputValidationError" in response) {
        throw response.inputValidationError;
      }
      if ("error" in response) {
        throw new Error(response.error);
      }
      if (!response.data) {
        throw new Error("Staff member not found");
      }
      return response.data;
    },
  });

export const staffRolesListOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: staffKeys.all(),
    queryFn: async () => {
      const response = await $listStaffRoles({
        page,
        pageSize,
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
