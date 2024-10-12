import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findMaintenanceRequests,
  getMaintenanceRequestById,
} from "@/server/db/queries/maintenance-request/read";

// Define the input schema
const GetMaintenanceRequestByIdInput = z.object({
  requestId: z.string().min(1, "Request ID is required"),
});

export const $getMaintenanceRequestById = createServerFn(
  "GET",
  async (input: z.input<typeof GetMaintenanceRequestByIdInput>) => {
    try {
      const result = GetMaintenanceRequestByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const maintenanceRequest = await getMaintenanceRequestById(
        result.data.requestId
      );

      return {
        data: maintenanceRequest ?? null, // Return null if no data is found
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

// Define the input schema for listing maintenance requests
const ListMaintenanceRequestsInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
  status: z.enum(["New", "In Progress", "Completed", "Cancelled"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
});

export const $listMaintenanceRequests = createServerFn(
  "GET",
  async (input: z.input<typeof ListMaintenanceRequestsInput>) => {
    try {
      const result = ListMaintenanceRequestsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const maintenanceRequests = await findMaintenanceRequests(result.data);

      return {
        data: maintenanceRequests ?? [],
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
