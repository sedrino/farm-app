import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addMaintenanceRequest,
  deleteMaintenanceRequest,
  updateMaintenanceRequest,
} from "@/server/db/queries/maintenance-request/write";

// Define the input schema
const CreateMaintenanceRequestInput = z.object({
  request: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
    completionDate: z.string().optional(),
  }),
  attachments: z.array(z.string()).default([]).optional(),
});

export const $createMaintenanceRequest = createServerFn(
  "POST",
  async (input: z.input<typeof CreateMaintenanceRequestInput>) => {
    try {
      const result = CreateMaintenanceRequestInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const maintenanceRequest = await addMaintenanceRequest(result.data);

      return {
        maintenanceRequest,
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
const DeleteMaintenanceRequestInput = z.object({
  requestId: z.string().min(1, "Request ID is required"),
});

export const $deleteMaintenanceRequest = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteMaintenanceRequestInput>) => {
    try {
      const result = DeleteMaintenanceRequestInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteMaintenanceRequest(result.data.requestId);

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
const UpdateMaintenanceRequestInput = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  updates: z.object({
    status: z.string().optional(),
    assignedStaffId: z.string().optional(),
    comments: z.string().optional(),
    completionDate: z.number().optional(),
  }),
});

export const $updateMaintenanceRequest = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateMaintenanceRequestInput>) => {
    try {
      const result = UpdateMaintenanceRequestInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedRequest = await updateMaintenanceRequest(result.data);

      return {
        request: updatedRequest,
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
