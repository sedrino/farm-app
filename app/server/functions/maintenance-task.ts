import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addMaintenanceTask,
  completeMaintenanceTask,
  deleteMaintenanceTask,
  updateMaintenanceTask,
} from "@/server/db/queries/maintenance-task/write";

// Define the input schema
const CompleteMaintenanceTaskInput = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  completionDate: z.number().min(1, "Completion date is required"),
  completionTime: z.number().min(1, "Completion time is required"),
});

export const $completeMaintenanceTask = createServerFn(
  "POST",
  async (input: z.input<typeof CompleteMaintenanceTaskInput>) => {
    try {
      const result = CompleteMaintenanceTaskInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const completedTask = await completeMaintenanceTask(result.data);

      return {
        task: completedTask,
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
const CreateMaintenanceTaskInput = z.object({
  task: z.object({
    taskName: z.string().min(1, "Task name is required"),
    description: z.string().min(1, "Description is required"),
    scheduledDate: z.number().min(1, "Scheduled date is required"),
    startTime: z.string().min(1, "Start time is required"),
    estimatedDuration: z.number().min(1, "Duration is required"),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
    assignedStaff: z.array(z.string()).optional(),
    recurrencePattern: z
      .enum(["one-time", "daily", "weekly", "monthly"])
      .default("one-time"),
    specialInstructions: z.string().optional(),
  }),
  stalls: z.array(z.string()).min(1, "At least one stall must be selected"),
});

export const $createMaintenanceTask = createServerFn(
  "POST",
  async (input: z.input<typeof CreateMaintenanceTaskInput>) => {
    try {
      const result = CreateMaintenanceTaskInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const maintenanceTask = await addMaintenanceTask(result.data);

      return {
        maintenanceTask,
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
const DeleteMaintenanceTaskInput = z.object({
  taskId: z.string().min(1, "Task ID is required"),
});

export const $deleteMaintenanceTask = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteMaintenanceTaskInput>) => {
    try {
      const result = DeleteMaintenanceTaskInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteMaintenanceTask(result.data.taskId);

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
const UpdateMaintenanceTaskInput = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  task: z.object({
    taskName: z.string().min(1, "Task name is required"),
    scheduledDate: z.string().min(1, "Scheduled date is required"),
    estimatedDuration: z.number().min(1, "Estimated duration is required"),
    priority: z.string().min(1, "Priority is required"),
    status: z.string().min(1, "Status is required"),
    recurrencePattern: z.string().optional(),
    specialInstructions: z.string().optional(),
    completionDate: z.string().optional(),
    completionTime: z.number().optional(),
    cost: z.number().optional(),
  }),
});

export const $updateMaintenanceTask = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateMaintenanceTaskInput>) => {
    try {
      const result = UpdateMaintenanceTaskInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedTask = await updateMaintenanceTask(result.data);

      return {
        task: updatedTask,
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
