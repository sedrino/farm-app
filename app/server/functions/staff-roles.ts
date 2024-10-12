import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findStaffRoles } from "@/server/db/queries/staff-role/read";

// Define the input schema
const ListStaffRolesInput = z.object({});

export const $listStaffRoles = createServerFn(
  "GET",
  async (input: z.input<typeof ListStaffRolesInput>) => {
    try {
      const result = ListStaffRolesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const staffRoles = await findStaffRoles();

      return {
        data: staffRoles ?? [], // Return an empty array if no roles are found
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: error.message,
        };
      } else {
        return {
          error: "Unknown error",
        };
      }
    }
  }
);
