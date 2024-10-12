import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import {
  addPasture,
  deletePasture,
  startPastureRotation,
  updatePasture,
} from "@/server/db/queries/pasture/write";

// Define the input schema
const CreatePastureInput = z.object({
  pasture: z.object({
    name: z.string().min(1, "Pasture name is required"),
    size: z.number().min(0, "Size must be positive"),
    location: z.string().min(1, "Location is required"),
    fencingType: z.string().min(1, "Fencing type is required"),
    waterSource: z.string().min(1, "Water source is required"),
    shadeAvailability: z.string().min(1, "Shade availability is required"),
    maxCapacity: z.number().min(0, "Max capacity must be positive"),
    notes: z.string().optional(),
  }),
});

export const $createPasture = createServerFn(
  "POST",
  async (input: z.input<typeof CreatePastureInput>) => {
    try {
      const result = CreatePastureInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const pasture = await addPasture(result.data);
      return {
        pasture,
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
const DeletePastureInput = z.object({
  pastureId: z.string().min(1, "Pasture ID is required"),
});

export const $deletePasture = createServerFn(
  "POST",
  async (input: z.input<typeof DeletePastureInput>) => {
    try {
      const result = DeletePastureInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deletePasture(result.data.pastureId);

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
const StartPastureRotationInput = z.object({
  pastureId: z.string().min(1, "Pasture ID is required"),
  rotationDetails: z
    .object({
      newOccupancy: z.number().optional(),
      newGrassCondition: z.string().optional(),
    })
    .optional(),
});

export const $startPastureRotation = createServerFn(
  "POST",
  async (input: z.input<typeof StartPastureRotationInput>) => {
    try {
      const result = StartPastureRotationInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const rotationData = result.data.rotationDetails || {};
      const pastureRotation = await startPastureRotation(
        result.data.pastureId,
        rotationData
      );

      return {
        pastureRotation,
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
const UpdatePastureInput = z.object({
  pastureId: z.string().min(1, "Pasture ID is required"),
  pasture: z.object({
    name: z.string().min(1, "Name is required"),
    size: z.string().min(1, "Size is required"),
    location: z.string().min(1, "Location is required"),
    fencingType: z.string().min(1, "Fencing type is required"),
    waterSource: z.string().min(1, "Water source is required"),
    shadeAvailability: z.string().min(1, "Shade availability is required"),
    maxCapacity: z.number().min(1, "Max capacity is required"),
    currentStatus: z.string().min(1, "Current status is required"),
    grassCondition: z.string().min(1, "Grass condition is required"),
    notes: z.string().optional(),
  }),
});

export const $updatePasture = createServerFn(
  "POST",
  async (input: z.input<typeof UpdatePastureInput>) => {
    try {
      const result = UpdatePastureInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const updatedPasture = await updatePasture(result.data);

      return {
        pasture: updatedPasture,
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
