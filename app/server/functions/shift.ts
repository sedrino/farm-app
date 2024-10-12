import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addShift,
  assignShift,
  deleteShift,
  updateShift,
} from "@/server/db/queries/shift/write";

// Define the input schema
const AssignShiftInput = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
  date: z.number().min(1, "Date is required"),
  startTime: z.number().min(0, "Start time is required"),
  endTime: z.number().min(0, "End time is required"),
  position: z.string().min(1, "Position is required"),
  assignedArea: z.string().min(1, "Assigned area is required"),
});

export const $assignShift = createServerFn(
  "POST",
  async (input: z.input<typeof AssignShiftInput>) => {
    try {
      const result = AssignShiftInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const shift = await assignShift(result.data);

      return {
        shift,
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
const CreateShiftInput = z.object({
  shift: z.object({
    staffId: z.string().min(1, "Staff member is required"),
    role: z.string().min(1, "Role is required"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    isRecurring: z.boolean().default(false),
    recurrenceFrequency: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const $createShift = createServerFn(
  "POST",
  async (input: z.input<typeof CreateShiftInput>) => {
    try {
      const result = CreateShiftInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const shift = await addShift(result.data);
      return {
        shift,
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
const DeleteShiftInput = z.object({
  shiftId: z.string().min(1, "Shift ID is required"),
});

export const $deleteShift = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteShiftInput>) => {
    try {
      const result = DeleteShiftInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteShift(result.data.shiftId);

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
const UpdateShiftInput = z.object({
  shiftId: z.string().min(1, "Shift ID is required"),
  shift: z.object({
    staffId: z.string().min(1, "Staff member is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    position: z.string().min(1, "Position is required"),
    notes: z.string().optional(),
    status: z.string().min(1, "Status is required"),
  }),
});

export const $updateShift = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateShiftInput>) => {
    try {
      const result = UpdateShiftInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedShift = await updateShift(result.data);

      return {
        shift: updatedShift,
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
