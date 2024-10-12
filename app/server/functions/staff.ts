import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findStaffPaginated,
  findStaffRoles,
  getStaffById,
} from "@/server/db/queries/staff/read";
import {
  addStaff,
  deleteStaff,
  updateStaff,
} from "@/server/db/queries/staff/write";

// Define the input schema
const GetStaffByIdInput = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
});

export const $getStaffById = createServerFn(
  "GET",
  async (input: z.input<typeof GetStaffByIdInput>) => {
    try {
      const result = GetStaffByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const staff = await getStaffById(result.data.staffId);

      return {
        data: staff ?? null, // the result from the query function returns undefined if no data is found, we need to that to be translated to null
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

// Define the input schema
const ListStaffInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  search: z.string().optional(),
  sort: z.enum(["name", "role", "status"]).catch("name"),
});

export const $listStaff = createServerFn(
  "GET",
  async (input: z.input<typeof ListStaffInput>) => {
    try {
      const result = ListStaffInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const staff = await findStaffPaginated(result.data);

      return {
        data: staff ?? [],
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

// Define the input schema
const ListStaffRolesInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
});

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

      const staffRoles = await findStaffRoles(result.data);

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

// Define the input schema
const CreateStaffInput = z.object({
  staff: z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    contactInformation: z.string().optional(),
    emergencyContact: z.string().optional(),
    availabilityPreferences: z.string().optional(),
  }),
});

export const $createStaff = createServerFn(
  "POST",
  async (input: z.input<typeof CreateStaffInput>) => {
    try {
      const result = CreateStaffInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const staff = await addStaff(result.data.staff);

      return {
        staff,
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

// Define the input schema
const DeleteStaffInput = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
});

export const $deleteStaff = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteStaffInput>) => {
    try {
      const result = DeleteStaffInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteStaff(result.data.staffId);

      return {
        success: true,
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

// Define the input schema
const UpdateStaffInput = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
  staff: z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    contactInformation: z.string().optional(),
    emergencyContact: z.string().optional(),
    availability: z.string().optional(),
  }),
});

export const $updateStaff = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateStaffInput>) => {
    try {
      const result = UpdateStaffInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedStaff = await updateStaff(result.data);

      return {
        staff: updatedStaff,
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
