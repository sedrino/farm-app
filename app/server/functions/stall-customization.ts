import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { getStallCustomizations } from "@/server/db/queries/stall-customization/read";
import {
  addStallCustomization,
  deleteStallCustomization,
} from "@/server/db/queries/stall-customization/write";

// Define the input schema
const AddStallCustomizationInput = z.object({
  stallId: z.string().min(1, "Stall ID is required"),
  customization: z.object({
    customizationType: z.string().min(1, "Customization type is required"),
    description: z.string().optional(),
    isPermanent: z.boolean().default(false),
    installationDate: z.number().optional(),
  }),
});

export const $addStallCustomization = createServerFn(
  "POST",
  async (input: z.input<typeof AddStallCustomizationInput>) => {
    try {
      const result = AddStallCustomizationInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const { stallId, customization } = result.data;
      const addedCustomization = await addStallCustomization({
        stallId,
        ...customization,
      });

      return {
        customization: addedCustomization,
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
const DeleteStallCustomizationInput = z.object({
  stallId: z.string().min(1, "Stall ID is required"),
  customizationId: z.string().min(1, "Customization ID is required"),
});

export const $deleteStallCustomization = createServerFn(
  "POST",
  async (input: z.input<typeof DeleteStallCustomizationInput>) => {
    try {
      const result = DeleteStallCustomizationInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      await deleteStallCustomization(result.data);

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
const GetStallCustomizationsInput = z.object({
  stallId: z.string().min(1, "Stall ID is required"),
});

export const $getStallCustomizations = createServerFn(
  "GET",
  async (input: z.input<typeof GetStallCustomizationsInput>) => {
    try {
      const result = GetStallCustomizationsInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const stallCustomizations = await getStallCustomizations(
        result.data.stallId
      );

      return {
        data: stallCustomizations ?? [], // Return an empty array if no customizations are found
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
