import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addStall,
  deleteStall,
  updateStall,
} from "@/server/db/queries/stall/write";

// Define the input schema
const CreateStallInput = z.object({
  stall: z.object({
    number: z.string().min(1, "Stall number is required"),
    size: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    features: z.array(z.string()).default([]).optional(),
    isAvailable: z.boolean().default(true),
    notes: z.string().optional(),
  }),
  customizations: z
    .array(
      z.object({
        customizationType: z.string().min(1, "Type is required"),
        description: z.string().optional(),
      })
    )
    .default([]),
});

export const $createStall = createServerFn(
  "POST",
  async (input: z.input<typeof CreateStallInput>) => {
    try {
      const result = CreateStallInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const stall = await addStall(result.data);

      return {
        stall,
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
const DeleteStallInput = z.object({
  stallId: z.string().min(1, "Stall ID is required"),
});

export const $deleteStall = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteStallInput>) => {
    try {
      const result = DeleteStallInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteStall(result.data.stallId);

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
const UpdateStallInput = z.object({
  stallId: z.string().min(1, "Stall ID is required"),
  stallData: z.object({
    number: z.string().min(1, "Stall number is required").optional(),
    size: z.string().min(1, "Size is required").optional(),
    location: z.string().min(1, "Location is required").optional(),
    features: z.array(z.string()).default([]).optional(),
    isAvailable: z.boolean().default(true).optional(),
    notes: z.string().optional(),
  }),
});

export const $updateStall = createServerFn(
  "POST",
  async (input: z.input<typeof UpdateStallInput>) => {
    try {
      const result = UpdateStallInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedStall = await updateStall(result.data);

      return {
        stall: updatedStall,
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
