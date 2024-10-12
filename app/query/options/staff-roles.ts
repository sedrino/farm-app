import { queryOptions } from "@tanstack/react-query";

import { $listStaffRoles } from "@/server/functions/staff-roles"; // Assuming this is the function to list staff roles

export const staffRoleKeys = {
  all: () => [{ scope: "staff-roles" }] as const,
};

export const staffRolesListOptions = ({
  page = 1,
  pageSize = 10,
}: { page?: number; pageSize?: number } = {}) =>
  queryOptions({
    queryKey: staffRoleKeys.all(),
    queryFn: async () => {
      const response = await $listStaffRoles({ page, pageSize });
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
