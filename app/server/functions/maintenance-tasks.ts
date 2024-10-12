import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  findMaintenanceTasks,
  findScheduledMaintenanceTasks,
  getMaintenanceTaskById,
} from "@/server/db/queries/maintenance-task/read";

// Define the input schema
const GetMaintenanceTaskByIdInput = z.object({
  taskId: z.string().min(1, "Task ID is required"),
});

export const $getMaintenanceTaskById = createServerFn(
  "GET",
  async (input: z.input<typeof GetMaintenanceTaskByIdInput>) => {
    try {
      const result = GetMaintenanceTaskByIdInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const maintenanceTask = await getMaintenanceTaskById(result.data.taskId);

      return {
        data: maintenanceTask ?? null, // Return null if no task is found
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

// Define the input schema for listing maintenance tasks
const ListMaintenanceTasksInput = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(50),
  filter: z.string().optional(),
});

export const $listMaintenanceTasks = createServerFn(
  "GET",
  async (input: z.input<typeof ListMaintenanceTasksInput>) => {
    try {
      const result = ListMaintenanceTasksInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const maintenanceTasks = await findMaintenanceTasks(result.data);

      return {
        data: maintenanceTasks ?? [],
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
const ListScheduledMaintenanceTasksInput = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(50),
  filter: z.enum(["overdue", "today", "future"]).catch("future"),
});

export const $listScheduledMaintenanceTasks = createServerFn(
  "GET",
  async (input: z.input<typeof ListScheduledMaintenanceTasksInput>) => {
    try {
      const result = ListScheduledMaintenanceTasksInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const scheduledTasks = await findScheduledMaintenanceTasks(result.data);

      return {
        data: scheduledTasks ?? [],
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
