import { createServerFn } from "@tanstack/start";
import { z } from "zod";

import { findCustomizationTypes } from "@/server/db/queries/customization-type/read";

// Define the input schema
const ListCustomizationTypesInput = z.object({});

export const $listCustomizationTypes = createServerFn(
  "GET",
  async (input: z.input<typeof ListCustomizationTypesInput>) => {
    try {
      const result = ListCustomizationTypesInput.safeParse(input);

      if (!result.success) {
        return {
          inputValidationError: result.error,
        };
      }

      const customizationTypes = await findCustomizationTypes();

      return {
        data: customizationTypes ?? [], // Return an empty array if no data is found
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
